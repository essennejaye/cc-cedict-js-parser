let tableBody = document.getElementById('dictionary');

fetch('/dict_entries')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    for (i = 0; i < data.length; i++) {
      let tableRow = document.createElement('tr');
      tableRow.setAttribute('id', 'row-key');
      tableRow.addEventListener('click', selectAnswer);

      for (const dataItem in data[i]) {
        textItem = data[i][dataItem];
        let tableCell = document.createElement('td');
        tableCell.appendChild(document.createTextNode(textItem));
        tableRow.appendChild(tableCell);
      }
      tableBody.appendChild(tableRow);
    }
  })
  .catch((error) => {
    console.error(
      'There has been a problem with your fetch operation: ',
      error
    );
  });

function selectAnswer(event) {
  let x = event.currentTarget.cells[3].innerHTML;
  console.log('cell selected ' + x);
}
