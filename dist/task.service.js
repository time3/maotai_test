"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const cheerio = require("cheerio");
const axios_1 = require("axios");
const node_xlsx_1 = require("node-xlsx");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
let TasksService = class TasksService {
    constructor() {
        this.url = 'http://quotes.money.163.com/f10/zycwzb_600519.html#01c01';
        this.title = '净利润(扣除非经常性损益后)(万元)';
        this.init();
    }
    async init() {
        await this.request();
    }
    async request() {
        const res = await axios_1.default.get(this.url);
        const $ = cheerio.load(res.data);
        const dataList = [];
        const titleList = [];
        $('.scr_table tr')
            .eq(0)
            .find('th')
            .each(function () {
            titleList.push($(this).text());
        });
        const index = $('.limit_sale tr').index($(`.limit_sale tr td:contains(${this.title})`).parent());
        $('.scr_table tbody tr')
            .eq(index)
            .find('td')
            .each(function () {
            dataList.push($(this).text());
        });
        const name = $('h1.name').text().split('(')[0].trim();
        const fileName = `茅台净利润-${name}-${moment().format('MM-DD-HH-mm-ss')}.xlsx`;
        const outputFolder = 'data';
        const outputPath = path.join(__dirname, '../', outputFolder, '/');
        const outputFile = `${outputPath}${fileName}`;
        const port = 3000;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        fs.writeFile(outputFile, node_xlsx_1.default.build([
            {
                name: 'sheet1',
                data: [titleList, dataList],
            },
        ], 'utf-8'), (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('文件生成成功');
            }
        });
    }
};
TasksService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=task.service.js.map