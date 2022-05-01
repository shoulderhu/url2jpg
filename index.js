const express = require('express'),
      app = express(),
      port = process.env.PORT || 5000;
const puppeteer = require('puppeteer'),
      args = ['--no-sandbox',                              // 不使用沙箱
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
           ];


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1200,
    })

    if (!req.query.url) {
        await page.goto('https://example.com');
    }
    else {
      await page.goto(req.query.url);
    }

    const image = await page.screenshot({fullPage : req.query.full});
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
});


app.get('/bluecoat', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 540,
    });

    await page.goto('https://sitereview.bluecoat.com/')
    if (req.query.url) {
        await page.click('#txtUrl');
        await page.keyboard.type(req.query.url);

        await page.click('#btnLookup');
        await page.waitForNavigation({
          waitUntil: 'networkidle0'
        });
    }

    const image = await page.screenshot({
      clip: {
        x: 390,
        y: 230,
        width: 1140,
        height: 238
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
});


app.get('/virustotal', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    if (req.query.search) {
      await page.goto('https://www.virustotal.com/gui/home/search', {
        waitUntil: 'networkidle0'
      })

      await page.keyboard.type(req.query.search);

      await page.keyboard.press('Enter');
      await page.waitForNavigation({
        waitUntil: 'networkidle0'
      });

      await timeout(1000);
    }
    else {
      await page.goto('https://www.virustotal.com/gui/home/upload')
    }

    const image = await page.screenshot({
      clip: {
        x: 330,
        y: 81,
        width: 1165,
        height: 530
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
