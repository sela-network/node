export function getFirstPostData() {
	const tweetElement = document.querySelector('div[data-testid="cellInnerDiv"]');

	if (!tweetElement) {
		return null;
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
	const image = imageElement
		? imageElement.src
		: '';
	const videoSources = videoElement
		? Array.from(
			videoElement.querySelectorAll('source'),
		).map((sourceElement) => sourceElement.src)
		: [];

	const like_regex = /\b(\d+) Like|Likes\b/;
	const retweet_regex = /\b(\d+)\s+(?:Repost|Reposts)\b/i;
	const reply_regex = /\b(\d+) Repl(ies|y)\. Reply\b/;

	const reply = tweetElement.innerHTML.match(reply_regex);
	const like = tweetElement.innerHTML.match(like_regex);
	const retweet =
		tweetElement.innerHTML.match(retweet_regex);

	return {
		content,
		image,
		video: videoSources,
		likesCount: like && like[1] ? +like[1] : 0,
		retweetsCount:
			retweet && retweet[1] ? +retweet[1] : 0,
		repliesCount: reply && reply[1] ? +reply[1] : 0,
		postedAt: postedAt,
	};
}
