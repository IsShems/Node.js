let input = document.getElementById('itemValue')
let button = document.getElementById('addButton')
const adding = () => {
    const itemValue = input.value;
    if (itemValue) {
        fetch('http://localhost:3000/addItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: itemValue })
        })
    } else {
        console.log('Input is empty, item not added.');
    }
}

button.addEventListener('click', adding);
