const express = require('express'),
      app = express(),
      port = process.env.PORT || 5000;
const puppeteer = require('puppeteer'),
      args = ['--no-sandbox',                             // 不使用沙箱
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
             '--ignore-certificate-errors'                // 忽略证书错误
             // '--proxy-server=127.0.0.1:8080'
           ],
      ads = ["/*.addthis.com",
            "/*.addthisedge.com",
            "/*.doubleclick.net",
            "/*.facebook.com",
            "/*.google.com",
            "/*.googleadservices.com",
            "/*.googlesyndication.com",
            "/*.line-scdn.net",
            "/*.moatads.com",
            "/*.popin.cc",
            "/*.rfp.fout.jp",
            "/*.scorecardresearch.com",
            'ad-specs.guoshipartners.com',
            'adservice.google.com',
            'adservice.google.com.tw',
            'analytics.google.com',
            'certify-js.alexametrics.com',
            'clients1.google.com',
            'cms.analytics.yahoo.com',
            'co-in.io',
            'connect.facebook.net',
            'cse.google.com',
            'go.trvdp.com',
            'itadapi.ithome.com.tw',
            'member.technews.tw',
            'onead.onevision.com.tw',
            'pv.ltn.com.tw',
            'redirect.prod.experiment.routing.cloudfront.aws.a2z.com',
            'social-plugins.line.me',
            'static.xx.fbcdn.net',
            'stg.truvidplayer.com',
            'sync.search.spotxchange.com',
            'technews.tw/wp-admin/*',
            'technews.tw/wp-content/plugins/*',
            'ws.coincap.io',
            'www.google-analytics.com',
            'www.googletagmanager.com',
            'www.googletagservices.com',
            'www.gstatic.com',
            'www.ithome.com.tw/modules/statistics/*',
            'www.ltn.com.tw',
            'www5.technews.tw',
      ]


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/*
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
*/

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

    await page.goto('https://sitereview.bluecoat.com/');
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

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    await page.goto('https://www.virustotal.com/gui/home/search', {
      waitUntil: 'networkidle0'
    });

    if (req.query.search) {
      await page.keyboard.type(req.query.search);

      await page.keyboard.press('Enter');
      await page.waitForNavigation({
        waitUntil: 'networkidle0'
      });

      await timeout(1000);
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

app.get('/www.ithome.com.tw/:cat(news|tech)/:id(\\d+)', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    await page.goto(`https://www.ithome.com.tw/${req.params.cat}/${req.params.id}`, {
      waitUntil: 'networkidle0'
    })

    const image = await page.screenshot({
      clip: {
        x: 310,
        y: 140,
        width: 1300,
        height: 850
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/technews.tw/:year(\\d{4})/:mon(\\d{2})/:day(\\d{2})/:title', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    await page.goto(`https://technews.tw/${req.params.year}/${req.params.mon}/${req.params.day}/${req.params.title}`, {
      waitUntil: 'networkidle0'
    })

    const image = await page.screenshot({
      clip: {
        x: 315,
        y: 230,
        width: 980,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

// Liberty Times Net
app.get('/3c.ltn.com.tw/news/:id(\\d+)', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    await page.goto(`https:/3c.ltn.com.tw/news/${req.params.id}`, {
      waitUntil: 'networkidle0'
    })

    const image = await page.screenshot({
      clip: {
        x: 370,
        y: 190,
        width: 860,
        height: 780
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/www.twcert.org.tw/tw/:id(cp-\\d{3}-\\d{4,}-[0-9a-z]{5}-\\d\.html)', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    await page.goto(`https://www.twcert.org.tw/tw/${req.params.id}`, {
      waitUntil: 'networkidle0'
    })

    const image = await page.screenshot({
      clip: {
        x: 370,
        y: 240,
        width: 1180,
        height: 700
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/blog.trendmicro.com.tw', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: args
    });

    const page = await browser.newPage();
    // await page.setCacheEnabled(false);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (ads.find((pattern) => request.url().match(pattern))) {
        request.abort();
      }
      else {
        request.continue();
      }
    })

    if (req.query.p) {
      await page.goto(`https://blog.trendmicro.com.tw/?p=${req.query.p}`, {
        waitUntil: 'networkidle0'
      })
    }
    else {
      await page.goto(`blog.trendmicro.com.tw`, {
        waitUntil: 'networkidle0'
      })
    }

    const image = await page.screenshot({
      clip: {
        x: 430,
        y: 150,
        width: 660,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
