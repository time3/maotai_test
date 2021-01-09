import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import xlsx from 'node-xlsx';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  private url = 'http://quotes.money.163.com/f10/zycwzb_600519.html#01c01';
  private title = '净利润(扣除非经常性损益后)(万元)';
  constructor(
  ) {
    this.init();
  }

  async init() {
    await this.request();
  }

  async request() {
    const res = await axios.get(this.url);
    const $ = cheerio.load(res.data);
    const dataList = [];
    const titleList = [];
    $('.scr_table tr')
      .eq(0)
      .find('th')
      .each(function () {
        titleList.push($(this).text());
      });
    const index = $('.limit_sale tr').index(
      $(`.limit_sale tr td:contains(${this.title})`).parent(),
    );
    $('.scr_table tbody tr')
      .eq(index)
      .find('td')
      .each(function () {
        dataList.push($(this).text());
      });

      const name = $('h1.name').text().split('(')[0].trim();
      const fileName = `茅台净利润-${name}-${moment().format(
        'MM-DD-HH-mm-ss',
      )}.xlsx`;
      const outputFolder = 'data';
      const outputPath = path.join(__dirname, '../', outputFolder, '/');
      const outputFile = `${outputPath}${fileName}`;
      const port = 3000;
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }
      fs.writeFile(
        outputFile,
        xlsx.build(
          [
            {
              name: 'sheet1',
              data: [titleList, dataList],
            },
          ],
          'utf-8',
        ),
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('文件生成成功');
          }
        },
      );
  }
}