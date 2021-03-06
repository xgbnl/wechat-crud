import {Interceptor} from "./Interceptor";
import {ResponseEnum} from "../Enum/ResponseEnum";
import {Helper} from "../Helper/Helper";

export class ResponseInterceptor extends Interceptor {

    interceptor(params) {

        const {code, msg} = params;

        switch (code) {
            case ResponseEnum.UNAUTHORIZED:
                Helper.abort(msg ?? '无效访问令牌');
                break;
            case ResponseEnum.FORBIDDEN:
                Helper.abort(msg ?? '访问被禁止');
                break;
            case ResponseEnum.NOT_FOUND:
                Helper.abort(msg ?? '页面不存在');
                break;
            case ResponseEnum.VALIDATE:
                Helper.abort(msg);
                break;
            case ResponseEnum.ERROR:
                Helper.abort(msg);
                break;
        }
    }
}