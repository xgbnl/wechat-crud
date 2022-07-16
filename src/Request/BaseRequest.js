import {Helper} from "../Helper/Helper";

export class BaseRequest {
    #host;
    #app;
    #headers;
    #configs;
    #requestInterceptor;

    constructor(reqInter, app) {
        this.#app = app;
        this.#host = this.#app.globalData.host;

        this.#headers = {
            json: 'application/json; charset=UTF-8',
            form: 'multipart/form-data',
        };

        this.#requestInterceptor = reqInter;
    }

    configure(url, options, upload = false) {

        if (!this.#requestInterceptor.interceptor(url)) {
            Helper.trigger('域名不合法');
            return false;
        }

        this.#configs = {
            url: `${this.#host}${this._prefix(url)}`,
            method: options.method,
            data: options.method === 'GET' ? options.data : this._stringify(options.data),
            header: {
                'Content-Type': upload ? this.#headers.form : this.#headers.json,
            },
        };

        this.#bearerAuthorization();

        // 解决微信不支持PATCH请求
        if (options.method === 'PATCH') {
            this.#setRequestPatch();
        }

        if (upload) {
            this.#setUpload(options);
        }

        return this.#configs;
    }

    #bearerAuthorization() {
        const token = wx.getStorageSync('access_token');

        if (token) {
            this.#configs.header['Authorization'] = `Bearer ${token}`;
        }
    }

    #setUpload(options) {
        delete this.#configs.data;
        this.#configs.filePath = options.filePath;
        this.#configs.name = options.filename;
    }

    #setRequestPatch() {
        this.#configs.method = 'POST';
        this.#configs.header['X-HTTP-Method-Override'] = 'PATCH';
    }

    _prefix(haystack, prefix = '/') {
        return haystack.startsWith(prefix) ? haystack : `${prefix}${haystack}`;
    }

    _parse(haystack) {
        return JSON.parse(haystack);
    }

    _stringify(haystack) {
        return JSON.stringify(haystack);
    }
}