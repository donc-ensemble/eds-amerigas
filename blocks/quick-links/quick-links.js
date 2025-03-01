import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    const extractedData = extractContentFromDOM(block);
    renderExtractedDataToDom(block, extractedData);
}

function extractContentFromDOM(element) {
    return Array.from(element.children).map(div => {
        const img = div.querySelector('img');
        const p = div.querySelector('p');
        return {
            text: p.textContent,
            image: {
                src: img.getAttribute('src'),
                width: img.getAttribute('width'),
                height: img.getAttribute('height'),
                loading: img.getAttribute('loading'),
                alt: img.getAttribute('alt') || ''
            }
        };
    });
}

function renderExtractedDataToDom(block, data) {
    const container = document.createElement('div');
    container.className = 'quick-links-inner-wrapper';
    
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'quick-link-card';
        const innerDiv1 = document.createElement('div');
        
        const picture = createOptimizedPicture(
            item.image.src,
            item.image.alt,
            item.image.loading === 'eager',
            [{ width: '750' }, { width: '2000' }]
        );
        
        const innerDiv2 = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = item.text;
        
        innerDiv1.appendChild(picture);
        innerDiv2.appendChild(p);
        div.appendChild(innerDiv1);
        div.appendChild(innerDiv2);
        container.appendChild(div);
    });
    
    block.textContent = '';
    block.appendChild(container);
}