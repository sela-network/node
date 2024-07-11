export const insertionScript = `
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


function getFirstPostData(rootElement) {
	const tweetElement = rootElement? rootElement : document.querySelector('div[data-testid="cellInnerDiv"]');

	if (!tweetElement) {
		return null;
	}
	
	let tweetId = null;
	const links = document.querySelectorAll('a');
	for(const link of links) {
		if(link.href?.includes('status')) {
		  const id = link.href.split('status/')[1];
		  tweetId = id.split('/')[0];
		  break;
		}
	}

	const textElement = tweetElement.querySelectorAll(
		'div[data-testid="tweetText"]',
	);
	const images = tweetElement.querySelectorAll(
		'img',
	);
	const imageElement = images[images.length - 1];

	const videoElement = tweetElement.querySelector(
		'video[preload="none"]',
	);
	const postedAtElement =
		tweetElement.querySelector('a time');

	const text = Array.from(textElement).map((text) =>
		text.textContent.trim(),
	);
	const content = text.join(' ');

	const postedAt = postedAtElement
		? postedAtElement.getAttribute('datetime')
		: null;
	let image = imageElement?.src || '';
	if (image.includes('default_profile_images')) {
	  image = '';
	}	
	const videoSources = videoElement
		? Array.from(
			videoElement.querySelectorAll('source'),
		).map((sourceElement) => sourceElement.src)
		: [];
	
	return {
		content,
		image,
		video: videoSources,
		postedAt: postedAt,
		tweetId,
		...getStats(tweetElement),
	};
}

function getVal (val) {
  multiplier = val.substr(-1).toLowerCase();
  if (multiplier == "k")
    return parseFloat(val) * 1000;
  else if (multiplier == "m")
    return parseFloat(val) * 1000000;
    
  return Number(val)
}

function getStats(tweetElement) {
	const reply = tweetElement.querySelector('button[data-testid="reply"]')
	const repliesCount = reply?.children[0]?.children[1]?.children[0]?.children[0]?.children[0]?.innerHTML;

	const retweet = tweetElement.querySelector('button[data-testid="retweet"]')
	const retweetsCount = retweet?.children[0]?.children[1]?.children[0]?.children[0]?.children[0]?.innerHTML;
	
	const likes = tweetElement.querySelector('button[data-testid="like"]')
	const likesCount = likes?.children[0]?.children[1]?.children[0]?.children[0]?.children[0]?.innerHTML;
	
	return {
		likesCount: likesCount ? getVal(likesCount) : 0,
		retweetsCount:
			retweetsCount ? getVal(retweetsCount) : 0,
		repliesCount: repliesCount ? getVal(repliesCount) : 0,
	}
}

async function getComments() {
	const tweetElement = document.querySelector('div[data-testid="cellInnerDiv"]');
	const stats = getStats(tweetElement);
	const repliesCount = Math.min(stats.repliesCount, 10);
	
	let comments = document.querySelectorAll('article[data-testid="tweet"]');
	const maxDepth = 2;
	let currentDepth = 0;
	const commentMap = {};

	while(comments.length < repliesCount && currentDepth++ < maxDepth) {
		for(const comment of comments) {
	  		const data = getFirstPostData(comment)
	  		commentMap[data.content] = data;
		}
		scrollToBottom();
		await sleep(1500)
		showHiddenComments();
		comments = document.querySelectorAll('article[data-testid="tweet"]');
	}
	
	return Object.values(commentMap);
}

function scrollToBottom() {
	window.scrollTo(0, document.body.scrollHeight);
}

function showHiddenComments() {
	const showBtn = document.querySelectorAll('article button[role="button"]')
	for(const btn of showBtn) {
  		if(btn.innerHTML.includes('Show')) {
  			console.log('clicking button to show')
    		btn.click()
  		}
	}

	const showSpamButtons = document.querySelectorAll('div[data-testid="cellInnerDiv"] button[role="button"]');
	for(const btn of showSpamButtons) {
  		if(btn.innerHTML.includes('Show probable spam')) {
  			console.log('clicking button to show')
    		btn.click()
  		}
	}
}
`;
