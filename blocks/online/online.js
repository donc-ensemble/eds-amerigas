import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    const extractedData = extractContentFromDOM(block);
    renderExtractedDataToDom(block, extractedData);
}

function extractContentFromDOM(element) {
    return {
        title: element.querySelector('h2').textContent.trim(),
        description: element.querySelector('p').textContent.trim(),
        link: {
            href: element.querySelector('a').getAttribute('href'),
            title: element.querySelector('a').getAttribute('title'),
            text: `Take Me to ${element.querySelector('a').textContent.trim()}`
        },
        image: {
            src: element.querySelector('img').getAttribute('src'),
            width: element.querySelector('img').getAttribute('width'),
            height: element.querySelector('img').getAttribute('height')
        }
    };
}

function renderExtractedDataToDom(block, extractedData) {
    const container = document.createElement('div');
    container.className = 'container';

    const content = document.createElement('div');
    content.className = 'content';

    const title = document.createElement('h2');
    title.textContent = extractedData.title;

    const description = document.createElement('p');
    description.textContent = extractedData.description;

    const button = document.createElement('a');
    button.href = extractedData.link.href;
    button.className = 'button';
    button.title = extractedData.link.title;
    button.textContent = extractedData.link.text;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const picture = createOptimizedPicture(
        extractedData.image.src,
        '',
        false,
        [{ width: extractedData.image.width, height: extractedData.image.height }]
    );

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(button);
    imageContainer.appendChild(picture);
    container.appendChild(content);
    container.appendChild(imageContainer);
    block.textContent = '';
    block.appendChild(container);
}