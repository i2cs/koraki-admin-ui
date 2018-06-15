import { HttpUrlEncodingCodec } from '@angular/common/http';
export declare class CustomHttpUrlEncodingCodec extends HttpUrlEncodingCodec {
    encodeKey(k: string): string;
    encodeValue(v: string): string;
}
