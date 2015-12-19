import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';

async function ooxx (page) {
  try {
    const url = `http://i.jandan.net/ooxx${page ? '/page-' + page : ''}`
    const body = await fetch(url, {
      'User-Agent': 'Baiduspider+(+http://www.baidu.com/search/spider.htm)'
    }).then(data => data.text())
    if (body.indexOf('http://tankr.net/s/medium/PKK7.gif') > -1) {
      return;
    }
    console.log(`fetching ${page || ''}...`)
    const $ = cheerio.load(body);
    const [ currentPage ] = $('.current-comment-page').first().text().match(/\d+/);
    const result = {
      images: [],
      currentPage
    };
    $('.view_img_link').each((i, el) => {
      result.images.push($(el).attr('href'));
    });
    fs.writeFileSync(`./api/${currentPage}.json`, JSON.stringify(result, null, 2), 'utf8');
    setTimeout(() => {
      ooxx(currentPage - 1);	
    }, 1000 * 60);
  } catch (err) {
    console.log(err.stack);
  }
}

ooxx();
