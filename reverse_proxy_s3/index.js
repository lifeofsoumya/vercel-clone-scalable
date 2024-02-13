const express = require('express')
const httpProxy = require('http-proxy')

const app = express();
const port = process.env.PORT || 8080;

const BUCKET_BASE_URL = `https://ocode.s3.ap-south-1.amazonaws.com/__outputs`

const proxy = httpProxy.createProxy();

app.get('*', (req, res)=>{
  const subdomain = req.hostname.split('.')[0];
  const resolvesTo = `${BUCKET_BASE_URL}/${subdomain}`;
  // console.log('resolve to ', resolvesTo)
  proxy.web(req, res, { target: resolvesTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq, req, res)=>{
  if(req.url === '/') proxyReq.path += 'index.html'
})

app.listen(port, ()=> console.log(`Reverse proxy server on ${port}`))