import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    const extractedData = extractContentFromDOM(block);
    renderExtractedDataToDom(block, extractedData);
}

function extractContentFromDOM(block) {
    return Array.from(block.children).map(service => {
        const title = service.querySelector('h3').textContent;
        const description = service.querySelector('p').textContent;
        const img = service.querySelector('img');
        return {
            title,
            description,
            image: {
                src: img.src,
                width: img.width,
                height: img.height,
                loading: img.loading,
                alt: img.alt
            }
        };
    });
}

function renderExtractedDataToDom(block, extractedData) {
    block.innerHTML = '';
    
    extractedData.forEach(service => {
        const serviceDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = service.title;
        const p = document.createElement('p');
        p.textContent = service.description;
        contentDiv.appendChild(h3);
        contentDiv.appendChild(p);
        
        const imageDiv = document.createElement('div');
        const picture = createOptimizedPicture(
            service.image.src,
            service.image.alt,
            service.image.loading === 'eager',
            [{ width: service.image.width }]
        );
        imageDiv.appendChild(picture);
        
        serviceDiv.appendChild(contentDiv);
        serviceDiv.appendChild(imageDiv);
        block.appendChild(serviceDiv);
    });
}