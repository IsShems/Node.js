fetch("http://localhost:5000/setCookie")
  .then((res) => res.text())
  .then((data) => console.log(data));
