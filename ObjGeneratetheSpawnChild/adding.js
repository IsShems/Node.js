let arr = [];

const adding = () => {
    arr.push('item');
    console.log('Item added:', arr);
}

setInterval(adding, 10000);
