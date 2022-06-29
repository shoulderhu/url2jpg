const express = require('express'),
      app = express(),
      port = process.env.PORT || 5000;
const puppeteer = require('puppeteer-extra'),
      StealthPlugin = require('puppeteer-extra-plugin-stealth'),
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
             '--disable-backgrounding-occluded-windows',
             '--disable-breakpad',
             '--disable-domain-reliability',
             '--disable-features=AudioServiceOutOfProcess',
             '--disable-ipc-flooding-protection',
             '--disable-notifications',
             '--disable-offer-store-unmasked-wallet-cards',
             '--disable-print-preview',
             '--disable-renderer-backgrounding',
             '--disable-speech-api',
             '--ignore-gpu-blacklist',
             '--metrics-recording-only',
             '--no-pings',
             '--password-store=basic',
             '--use-mock-keychain',
             '--mute-audio',                              // 静音
             '--single-process',                          // 单进程
             '--no-zygote',                               // 禁止zygote进程fork子进程
             '--safebrowsing-disable-auto-update',
             '--no-first-run',                            // 禁止首次运行界面
             '--hide-scrollbars',                         // 隐藏滚动栏
             '--ignore-certificate-errors'                // 忽略证书错误
             //'--proxy-server=127.0.0.1:8080'
           ],
      ads = ["/*.addthis.com",
            "/*.addthisedge.com",
            "/*.analytics.yahoo.com",
            "/*.at.atwola.com",
            "/*.aralego.com",
            "/*.criteo.com",
            "/*bidswitch.net",
            "/*.doubleclick.net",
            "/*.facebook.com",
            "/*.google.com",
            "/*.googleadservices.com",
            "/*.googleapis.com",
            "/*.googlesyndication.com",
            "/*.line-scdn.net",
            "/*.moatads.com",
            "/*.openx.net",
            "/*.popin.cc",
            "/*.pubmatic.com",
            "/*.rfp.fout.jp",
            "/*.rubiconproject.com",
            "/*.scorecardresearch.com",
            "/*.servedby-buysellads.com",
            "/*.taboola.com",
            "/*.wp.com",
            'a.teads.tv',
            'ad2.apx.appier.net',
            'ad-specs.guoshipartners.com',
            'adserver-toy.adtechjp.com',
            'adservice.google.com',
            'adservice.google.com.tw',
            'analytics.google.com',
            'assets.video.yahoo.net',
            'bats.video.yahoo.com',
            'bnextmedia.s3.hicloud.net.tw/dp_cp/*',
            'buzzorange.com/techorange/app/plugins/*',
            'buzzorange.com/techorange/app/themes/ceris/js/vendors/*',
            'buzzorange.com/techorange/wp/wp-admin/*',
            'c2shb.ssp.yahoo.com',
            'cdn.bnextmedia.com.tw/bn/images/*',
            'cdn.carbonads.com',
            'cdnjs.cloudflare.com/ajax/libs/datatables/*',
            'dpm.demdex.net',
            'srv.carbonads.net',
            'c2shb.ssp.yahoo.com',
            'certify-js.alexametrics.com',
            'clients1.google.com',
            'cms.analytics.yahoo.com',
            'co-in.io',
            'connect.facebook.net',
            'cse.google.com',
            'go.trvdp.com',
            'guce.yahoo.com',
            'ib.adnxs.com',
            'itadapi.ithome.com.tw',
            'jill.fc.yahoo.com',
            'member.technews.tw',
            'misc.udn.com',
            'onead.onevision.com.tw',
            'p.udn.com.tw',
            'platform.twitter.com',
            'pv.ltn.com.tw',
            'ps.eyeota.net',
            'redirect.prod.experiment.routing.cloudfront.aws.a2z.com',
            's.yimg.com/nn/lib/metro/g/myy/advertisement_0.0.19.js',
            'social-plugins.line.me',
            'static.xx.fbcdn.net',
            'static.criteo.net',
            'stg.truvidplayer.com',
            'sync.search.spotxchange.com',
            'sync.crwdcntrl.net',
            'prebid.scupio.com',
            'technews.tw/wp-admin/*',
            'technews.tw/wp-content/plugins/*',
            'tw.news.yahoo.com/comments/*',
            'udc.yahoo.com',
            'udn.com/static/img/*',
            'udesign.udnfunlife.com',
            'video.adaptv.advertising.com',
            'web-oao.ssp.yahoo.com/admax/*',
            'ws.coincap.io',
            'www.abuseipdb.com/img/bitcoin.svg',
            'www.bnext.com.tw/ucf-sw.js',
            'www.bnext.com.tw/api/*',
            'www.bnext.com.tw/icons/*',
            'www.bnext.com.tw/lottie/scroll-to-top.json',
            'www.bnext.com.tw/lottie/clapping.json',
            'www.bnext.com.tw/lottie/clapping-hover.json',
            'www.google-analytics.com',
            'www.googletagmanager.com',
            'www.googletagservices.com',
            'www.gstatic.com',
            'www.informationsecurity.com.tw/images/*',
            'www.inside.com.tw/assets/js/*',
            'www.inside.com.tw/assets/images/*',
            'www.inside.com.tw/cdn-cgi/scripts/*',
            'www.instagram.com',
            'www.ithome.com.tw/modules/statistics/*',
            'www.ltn.com.tw',
            'www.yahoo.com',
            'www.youtube.com',
            'www5.technews.tw'
      ]
const swaggerUi = require('swagger-ui-express'),
      swaggerDocument = require('./swagger.json');
const compression = require('compression'),
      shouldCompress = (req, res) => {
        if (/image\/jpeg/.test(res.getHeader('Content-Type'))) { return true; }
        if (req.headers['x-no-compression']) { return false; }
        return compression.filter(req, res);
      };


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


puppeteer.use(StealthPlugin())

app.use(compression({
  filter: shouldCompress
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
   res.redirect(302, '/api-docs');
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
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 390,
        y: 230,
        width: 1140,
        height: 238
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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

      try {
        await page.waitForNavigation({
          waitUntil: 'networkidle0'
        });

        await timeout(1000);
      } catch (e) {
        console.log(e);
      }
    }

    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 330,
        y: 81,
        width: 1165,
        height: 530
      }
    });

    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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

    await page.goto(`https://www.ithome.com.tw/${req.params.cat}/${req.params.id}`)
    await page.waitForSelector('.content-summary');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 310,
        y: 140,
        width: 1300,
        height: 850
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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

    await page.goto(`https://technews.tw/${req.params.year}/${req.params.mon}/${req.params.day}/${req.params.title}`)
    await page.waitForSelector('.entry-title');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 315,
        y: 230,
        width: 980,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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

    await page.goto(`https://3c.ltn.com.tw/news/${req.params.id}`);
    await page.waitForSelector('.time');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 370,
        y: 190,
        width: 860,
        height: 780
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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

    await page.goto(`https://www.twcert.org.tw/tw/${req.params.id}`);
    await page.waitForSelector('.title');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 370,
        y: 240,
        width: 1180,
        height: 700
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
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
      await page.goto(`https://blog.trendmicro.com.tw/?p=${req.query.p}`);
      await page.waitForSelector('.entry-title');
    }
    else {
      await page.goto(`blog.trendmicro.com.tw`, {
        waitUntil: 'networkidle0'
      })
    }

    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 430,
        y: 150,
        width: 660,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

// Business Next
app.get('/www.bnext.com.tw/article/:id(\\d+)/:title', async (req, res) => {
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

    await page.goto(`https://www.bnext.com.tw/article/${req.params.id}/${req.params.title}`, {
        waitUntil: 'networkidle0'
    });
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 339,
        y: 137,
        width: 1200,
        height: 412
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/www.inside.com.tw/article/:title(\\d+-*)', async (req, res) => {
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

    await page.goto(`https://www.inside.com.tw/article/${req.params.title}`);
    await page.waitForSelector('#article_content');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 590,
        y: 240,
        width: 740,
        height: 700
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/udn.com/news/story/:id1(\\d+)/:id2(\\d+)', async (req, res) => {
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

    await page.goto(`https://udn.com/news/story/${req.params.id1}/${req.params.id2}`);
    await page.waitForSelector('#keywords');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 315,
        y: 515,
        width: 940,
        height: 500
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/tw.news.yahoo.com/:id(*-\\d{9}\.html)', async (req, res) => {
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

    await page.goto(`https://tw.news.yahoo.com/${req.params.id}`, {
      waitUntil: 'domcontentloaded'
    });
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 330,
        y: 560,
        width: 910,
        height: 740
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/buzzorange.com/techorange/:year(\\d{4})/:mon(\\d{2})/:day(\\d{2})/:title', async (req, res) => {
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

    await page.goto(`https://buzzorange.com/techorange/${req.params.year}/${req.params.mon}/${req.params.day}/${req.params.title}`)
    await page.waitForSelector('.single-content__wrap');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 370,
        y: 250,
        width: 980,
        height: 640
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/www.informationsecurity.com.tw/article/article_detail.aspx', async (req, res) => {
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

    if (req.query.aid) {
      await page.goto(`https://www.informationsecurity.com.tw/article/article_detail.aspx?aid=${req.query.aid}`);
      await page.waitForSelector('.text');
    }
    else {
      await page.goto(`www.informationsecurity.com.tw`, {
        waitUntil: 'networkidle0'
      })
    }

    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 355,
        y: 280,
        width: 775,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.get('/chinese.engadget.com/:id(*-\\d{9}\.html)', async (req, res) => {
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

    await page.goto(`https://chinese.engadget.com/${req.params.id}`,);
    await page.waitForSelector('.article-text');
    const image = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      clip: {
        x: 600,
        y: 350,
        width: 800,
        height: 730
      }
    });
    await browser.close();

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
