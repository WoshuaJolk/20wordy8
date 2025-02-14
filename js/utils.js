let ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let DICTIONARY = null,
	DICT_TREE = null;
let DEFINITIONS = {};
let definitionsLoaded = false;

// Merge the alphabets of 2 tiles or a single string
function buildAlphabet(a, b) {
	if (typeof a === 'string' && b === undefined) {
		const map = {};

		for (let i = 0; i < a.length; i++) {
			const char = a.charAt(i);

			if (char in map) {
				map[char]++;
			} else {
				map[char] = 1;
			}
		}

		return map;
	} else {
		const map = {};

		for (let i = 0; i < a.value.length; i++) {
			const char = a.value.charAt(i);

			if (char in map) {
				map[char]++;
			} else {
				map[char] = 1;
			}
		}

		for (let i = 0; i < b.value.length; i++) {
			const char = b.value.charAt(i);

			if (char in map) {
				map[char]++;
			} else {
				map[char] = 1;
			}
		}

		return map;
	}
}

fetch('https://cdn.jasonxu.dev/64837ed1e288cb2af31a6572')
	.then((res) => (console.time('fetching'), res.text()))
	.then((data) => {
		console.timeEnd('fetching');
		console.time('parsing');
		const words = data
			.replace(/\r/g, '')
			.split('\n')
			.map((str) => {
				const [word, def] = str.split('\t');

				return [word.toLowerCase(), def];
			});
		console.timeEnd('parsing');

		words.forEach(([word, def]) => {
			DEFINITIONS[word] = def;
		});
		definitionsLoaded = true;
	});

fetch('https://cdn.jasonxu.dev/6487c069e288cb2af31a6573')
	.then((res) => (console.time('fetching words only'), res.text()))
	.then((data) => {
		if (DICTIONARY === null) {
			console.timeEnd('fetching words only');
			console.time('parsing');
			DICTIONARY = data
				.replace(/\r/g, '')
				.split('\n')
				.map((word) => word.toLowerCase());
			console.timeEnd('parsing');

			console.time('building tree');
			buildTree();
			console.timeEnd('building tree');
			start();
		}
	});

function buildTree() {
	if (DICTIONARY === null || DICT_TREE !== null) {
		return;
	}

	DICT_TREE = {};

	for (const word of DICTIONARY) {
		insert(word);
	}
}

function insert(word) {
	let currentNode = DICT_TREE;
	const wordAlphabet = buildAlphabet(word);

	for (const letter of ALPHABET) {
		// If the letter is present in the word
		if (letter in wordAlphabet) {
			// If there is already an entry in the tree at this position for this letter
			if (letter in currentNode) {
				const childNode = currentNode[letter];

				// If the entry already has the appearance frequency
				if (wordAlphabet[letter] in childNode) {
					if (isLastLetter(wordAlphabet, letter)) {
						// Since this is the last letter in the insertion, just append to words list
						childNode[wordAlphabet[letter]].words.push(word);
						return;
					} else {
						// Otherwise, update the iteration node and continue iteration
						currentNode = childNode[wordAlphabet[letter]];
					}
				} else {
					// If this is the last letter in the insertion, create the frequency node and insert
					if (isLastLetter(wordAlphabet, letter)) {
						childNode[wordAlphabet[letter]] = {
							words: [word]
						};
						return;
					} else {
						// Otherwise, create the node and continue insertion
						const freqNode = {
							words: []
						};

						childNode[wordAlphabet[letter]] = freqNode;

						currentNode = freqNode;
					}
				}
			} else {
				// If this is the last letter in the insertion, just create a fresh node and insert
				if (isLastLetter(wordAlphabet, letter)) {
					currentNode[letter] = {
						[wordAlphabet[letter]]: {
							words: [word]
						}
					};
					return;
				} else {
					// Otherwise, create the frequency node and continue iteration
					const freqNode = {
						words: []
					};

					currentNode[letter] = {
						[wordAlphabet[letter]]: freqNode
					};

					currentNode = freqNode;
				}
			}
		}
	}
}

function isLastLetter(alphabet, letter) {
	return ALPHABET.slice(ALPHABET.indexOf(letter) + 1).every((l) => !(l in alphabet));
}

// Will never return empty string (ok to check truthiness value for existence)
function getWord(alphabet) {
	let currentNode = DICT_TREE;

	for (const letter of ALPHABET) {
		if (letter in alphabet) {
			if (letter in currentNode) {
				if (alphabet[letter] in currentNode[letter]) {
					if (isLastLetter(alphabet, letter)) {
						const words = currentNode[letter][alphabet[letter]].words;

						console.log('Possible words:', words);

						return words.length === 0 ? null : words[Math.floor(Math.random() * words.length)];
					} else {
						currentNode = currentNode[letter][alphabet[letter]];
					}
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
	}

	return null;
}

function getDefinition(word) {
	if (!definitionsLoaded) {
		return Promise.resolve('Definitions are not loaded yet...');
	}

	if (word in DEFINITIONS) {
		return Promise.resolve(DEFINITIONS[word]);
	} else {
		return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
			.then((res) => res.json())
			.then((data) => (DEFINITIONS[word] = data[0].meanings[0].definitions[0].definition))
			.catch(() => (DEFINITIONS[word] = 'idk sry :('))
			.finally(() => DEFINITIONS[word]);
	}
}

