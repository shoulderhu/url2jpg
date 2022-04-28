const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

const puppeteer = require("puppeteer");


app.get('/', (req, res) => {
  puppeteer.launch({
    headless: true,
    args: ['--no-sandbox',                              // 不使用沙箱
           '--no-startup-window',                       // 禁止开始界面
           '--incognito',                               // 隐身模式
           '--disable-infobars',                        // 禁止信息提示栏
           '--disable-gpu',                             // 不用gpu
           '--disable-setuid-sandbox',                  // 与--no-sandbox配合
           '--no-default-browser-check',                // 不检查默认浏览器
           '--disable-extensions',                      // 禁止扩展
           '--disable-default-apps',                    // 禁止默认应用
           '--disable-dev-shm-usage',                   // 禁止使用/dev/shm，防止内存不够用
           '--disable-hang-monitor',                    // 禁止页面无响应提示
           '--disable-popup-blocking',                  // 禁止popup
           '--disable-prompt-on-repost',                // 禁止重新发送post请求的提示
           '--disable-sync',                            // 禁止同步
           '--disable-translate',                       // 禁止翻译
           '--disable-bundled-ppapi-flash',             // 禁止内置的flash
           '--disable-component-update',                // 禁止组件升级
           '--disable-background-networking',           // 禁止后台的网络连接
           '--disable-background-timer-throttling',     // 禁止后台任务冻结
           '--disable-client-side-phishing-detection',  // 禁止危险页面检测
           '--disable-logging',
           '--mute-audio',                              // 静音
           '--single-process',                          // 单进程
           '--no-zygote',                               // 禁止zygote进程fork子进程
           '--safebrowsing-disable-auto-update',
           '--no-first-run',                            // 禁止首次运行界面
           '--hide-scrollbars',                         // 隐藏滚动栏
           '--ignore-certificate-errors',               // 忽略证书错误
         ]}
  ).then(async function(browser) {
    const page = await browser.newPage();
    await page.goto("http://example.com/");

    const image = await page.Screenshot({fullPage: true});
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  });
})
