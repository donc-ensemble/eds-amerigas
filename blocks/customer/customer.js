export default function decorate(block) {
  const extractedData = extractContentFromDOM(block);
  renderExtractedDataToDom(block, extractedData);
}

function extractContentFromDOM(block) {
  const customerBlock = block;
  const paragraphs = Array.from(customerBlock.querySelectorAll('p:not(.button-container)')).map(p => p.textContent);
  const buttons = Array.from(customerBlock.querySelectorAll('.button')).map(button => ({
      text: button.textContent,
      href: button.getAttribute('href'),
      title: button.getAttribute('title')
  }));

  return {
      mainClass: customerBlock.className,
      dataBlockName: customerBlock.getAttribute('data-block-name'),
      dataBlockStatus: customerBlock.getAttribute('data-block-status'),
      paragraphs,
      buttons
  };
}

function renderExtractedDataToDom(block, extractedData) {
  const mainContainer = document.createElement('div');
  mainContainer.className = extractedData.mainClass;
  mainContainer.setAttribute('data-block-name', extractedData.dataBlockName);
  mainContainer.setAttribute('data-block-status', extractedData.dataBlockStatus);

  const innerDiv1 = document.createElement('div');
  const innerDiv2 = document.createElement('div');

  extractedData.paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      innerDiv2.appendChild(p);
  });

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'buttons-wrapper';
  
  extractedData.buttons.forEach(button => {
      const p = document.createElement('p');
      p.className = 'button-container';
      
      const a = document.createElement('a');
      a.href = button.href;
      a.title = button.title;
      a.className = 'button';
      a.textContent = button.text;
      
      p.appendChild(a);
      buttonContainer.appendChild(p);
  });

  innerDiv1.appendChild(innerDiv2);
  innerDiv1.appendChild(buttonContainer);
  mainContainer.appendChild(innerDiv1);
  block.innerHTML = '';
  block.appendChild(mainContainer);
}
