import http from 'http';

http.get("http://127.0.0.1:4280/hi.txt", (res) => {
    console.log(res);
});