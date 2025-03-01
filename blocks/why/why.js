import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    const extractedData = extractContentFromDOM(block);
    renderExtractedDataToDom(block, extractedData);
}

function extractContentFromDOM(element) {
    const items = Array.from(element.querySelectorAll(':scope > div')).map(div => {
        const img = div.querySelector('img');
        const title = div.querySelector('div:nth-child(2) p').textContent;
        const description = div.querySelector('div:nth-child(3) p').textContent;
        return {
            image: {
                src: img ? img.src : `https://picsum.photos/80/80`,
                width: img ? img.width : 80,
                height: img ? img.height : 80,
                loading: img ? img.loading : 'lazy',
                alt: img ? img.alt : ''
            },
            title,
            description
        };
    });
    return items;
}

function renderExtractedDataToDom(block, data) {
    const container = document.createElement('div');
    container.className = 'why-section';
    
    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'why-item';
        
        const picture = createOptimizedPicture(
            item.image.src,
            item.image.alt,
            item.image.loading === 'eager',
            [{ width: item.image.width }]
        );
        
        const title = document.createElement('h2');
        title.textContent = item.title;
        
        const description = document.createElement('p');
        description.textContent = item.description;
        
        itemDiv.appendChild(picture);
        itemDiv.appendChild(title);
        itemDiv.appendChild(description);
        container.appendChild(itemDiv);
    });
    
    block.textContent = '';
    block.appendChild(container);
}