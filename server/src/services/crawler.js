require('dotenv').config();
const RSSParser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const News = require('../models/news');

// Kết nối đến MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/news', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Hàm thu thập thông tin của một bài viết từ URL
async function crawlArticle(url) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
  
      const article = {
        title: $('h1.title-detail').text().trim(),
        type: $('.header-content.width_common ul.breadcrumb li a')
          .map((index, element) => $(element).text().trim())
          .get()
          .filter(text => text !== '')
          .join(', ') || 'Null',
        author: $('p.author_mail').text().trim() || $('p.Normal').last().text().trim(),
        description: $('p.description')
          .find('span')
          .append('- ')
          .end()
          .text()
          .trim() || 'Null',
        dateTime: $('span.date').text().trim() || 'Null',
        isoTime: convertDbDateTimeToJSDate($('span.date').text()) || 'Null',
        mainText: [],
        imgLinks: []
      };
  
      $('p.Normal').each((index, element) => {
        const text = $(element).text().trim();
        if (text) {
          article.mainText.push(text);
        }
      });
  
      $('img[itemprop=contentUrl]').each((index, element) => {
        const caption = $(element).attr('alt');
        const src = $(element).attr('data-src');
        if (caption && src) {
          article.imgLinks.push({
            url: src,
            title: caption,
            type: 'image'
          });
        }
      });
  
      return article;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Hàm chuyển đổi chuỗi ngày giờ từ định dạng của cơ sở dữ liệu sang đối tượng Date
function convertDbDateTimeToJSDate(dateTimeString) {
    // Tách các thành phần ngày, tháng, năm, giờ, phút
    var parts = dateTimeString.split(/[ ,:]+/);
    var day = parseInt(parts[2].split('/')[0]);
    var month = parseInt(parts[2].split('/')[1]) - 1; // Trừ đi 1 vì tháng trong JavaScript bắt đầu từ 0
    var year = parseInt(parts[2].split('/')[2]);
    var hour = parseInt(parts[3]);
    var minute = parseInt(parts[4]);
    // Tạo đối tượng Date từ các thành phần trên
    return new Date(year, month, day, hour, minute);
}

// Hàm thu thập các bài viết mới nhất từ nguồn RSS và lưu vào MongoDB
async function crawlRSSAndSaveLatestArticle() {
    try {
        const parser = new RSSParser();
        const feed = await parser.parseURL("https://vnexpress.net/rss/the-thao.rss");

        // Lấy bài viết gần đây nhất từ cơ sở dữ liệu
        const latestNews = await News.findOne({}).sort({ 'isoTime': -1 });

        // Lặp qua các mục trong feed
        for await (const item of feed.items) {
            const itemDate = new Date(item.pubDate);
            // console.log(itemDate > latestNews.isoTime && item.title !== latestNews.title);
            // So sánh thời gian của bài viết từ RSS feed với bài viết gần đây nhất từ cơ sở dữ liệu
            if (!latestNews || itemDate > latestNews.isoTime && item.title.trim() !== latestNews.title.trim()) {
                console.log(`Crawling article from: ${item.link}`);
                const article = await crawlArticle(item.link);
                if (article) {
                    // Create a new News document and save it to MongoDB
                    const news = new News(article);
                    await news.save();
                    console.log(`Article "${article.title}" saved to MongoDB.`);
                }
            } else {
                // Đã đủ bài viết mới nhất từ RSS feed
                console.log("not new article");
                break;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
}

crawlRSSAndSaveLatestArticle();
