const converter = new showdown.Converter()
converter.setOption('simplifiedAutoLink', true)
converter.setOption('simpleLineBreaks', true)
converter.setOption('openLinksInNewWindow', true)
converter.setOption('emoji', true)


function makeToc(sourceElement, targetElement) {
	const hs = []
	function recurse(nodes) {
		nodes.forEach(node => {
			const children = Array.from(node.childNodes)
			if (children.length) recurse(children)
			if (/h[1-6]/i.test(node.tagName)) {
				hs.push({
					id: node.getAttribute('id'),
					level: +node.tagName.substring(1),
					label: node.innerText
				})
			}
		})
	}
	recurse(Array.from(sourceElement.childNodes))
	// console.info(hs);

	targetElement.innerHTML = ''
	if (hs.length) {
		hs.forEach(h => {
			const div = document.createElement('div')
			div.classList.add('tocentry')
			div.style = `--level:${h.level}`
			div.innerText = h.label
			div.setAttribute("mdhid", h.id)
			div.addEventListener('click', click => {
				document.querySelector(`#${h.id}`)?.scrollIntoView({ behavior: 'smooth' })
			})
			targetElement.appendChild(div)
		})
		targetElement.style.display = ''
	} else {
		targetElement.style.display = 'none'
	}
}


function makeHtml(textarea) {
	// console.log(md);
	let mdbitwardenDiv = document.querySelector('#mdbitwarden')
	let tocDiv = document.querySelector('#notestoc')
	let mdDiv = document.querySelector('#notesmarkdown')
	if (!mdbitwardenDiv) {
		mdbitwardenDiv = document.createElement('div')
		mdbitwardenDiv.id = 'mdbitwarden'
		textarea.parentElement.appendChild(mdbitwardenDiv)

		tocDiv = document.createElement('div')
		tocDiv.id = 'notestoc'
		mdbitwardenDiv.appendChild(tocDiv)

		mdDiv = document.createElement('div')
		mdDiv.id = 'notesmarkdown'
		mdbitwardenDiv.appendChild(mdDiv)

		const helpLink = document.createElement('a')
		helpLink.href = 'https://www.markdownguide.org/basic-syntax'
		helpLink.target = '_blank'
		helpLink.innerText = 'Markdown'
		helpLink.style.marginInline = '8px'
		document.querySelector('label[for="notes"]').appendChild(helpLink)
	}
	mdDiv.innerHTML = converter.makeHtml(textarea.value)
	if (mdDiv.innerHTML !== '') {
		makeToc(mdDiv, tocDiv);
		mdbitwardenDiv.style.display = ''
	} else {
		mdbitwardenDiv.style.display = 'none'
	}
}


function addListener(textarea) {
	let timeout
	textarea.addEventListener('keyup', event => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => makeHtml(event.target), 333)
	})
	// console.log('attached');
}


window.addEventListener('load', () => {
	if (document.title.match(/.*Bitwarden Web Vault.*/)) {
		console.info('🛡️ MDBitwarden activated');
		setInterval(() => {
			const textarea = document.querySelector('#notes')
			if (textarea && !textarea.getAttribute('mdbitwarden')) {
				textarea.setAttribute('mdbitwarden', 'attached')
				addListener(textarea)
				makeHtml(textarea)
			}
		}, 500)
	}
})