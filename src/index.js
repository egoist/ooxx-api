import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import mkdirp from 'mkdirp';

async function ooxx (page) {
  try {
    const url = `http://i.jandan.net/ooxx${page ? '/page-' + page : ''}`
    const body = await fetch(url, {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
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
    ooxx(currentPage - 1);
  } catch (err) {
    console.log(err.stack);
  }
}

ooxx();