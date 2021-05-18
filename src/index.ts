declare const Ya: any;

export class Metrika {
  private _metricaInsert?: Promise<YandexMetrika>;
  private _counter!: YandexMetrika;

  constructor(public counterConfig: YandexCounterConfig, initCounterAfterInitialize: boolean = true) {
    if (initCounterAfterInitialize) {
      this.getCounter();
    }
  }

  public getCounter(): Promise<YandexMetrika> {
    if (typeof this._metricaInsert === 'undefined') {
      this._metricaInsert = new Promise<YandexMetrika>((resolve, reject) => {
        const node: HTMLScriptElement | undefined = document.getElementsByTagName('script')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        script.onload = (e: Event) => {
          // resolve promise after YandexMetrica Init
          document.addEventListener(`yacounter${this.counterConfig.id}inited`, () => {
            resolve(this._counter);
          });
          this._counter = new Ya.Metrika2(this.counterConfig);
        };
        if (typeof node !== 'undefined' && node.parentNode !== null) {
          node.parentNode.insertBefore(script, node);
        } else {
          document.appendChild(script);
        }
      });
    }
    return this._metricaInsert;
  }

  public async getClientID(): Promise<string> {
    const counter = await this.getCounter();
    return counter.getClientID();
  }

  public async setUserID(userId: string): Promise<void> {
    const counter = await this.getCounter();
    counter.setUserID(userId);
  }

  public async userParams(params: any): Promise<void> {
    const counter = await this.getCounter();
    counter.userParams(params);
  }

  public async params(params: any): Promise<void> {
    const counter = await this.getCounter();
    counter.userParams(params);
  }

  public async replacePhones(): Promise<void> {
    const counter = await this.getCounter();
    counter.replacePhones();
  }

  public async fireEvent(type: string, options: CommonOptions = {}): Promise<void> {
    const counter = await this.getCounter();
    return new Promise<void>((resolve: () => void) => {
      counter.reachGoal(type, options, resolve, this);
    });
  }

  public async hit(url: string, options: HitOptions = {}): Promise<any> {
    const counter = await this.getCounter();

    return new Promise<void>((resolve: () => void) => {
      options.callback = resolve;
      counter.hit(url, options);
    });
  }
}
export interface YandexCounterConfig {
  id: number;
  defer: boolean;
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
  webvisor?: boolean;
  trackHash?: boolean;
  ut?: string;
  triggerEvent: boolean;
}

export interface CallbackOptions {
  callback?: () => any;
  ctx?: any;
}

export interface CommonOptions extends CallbackOptions {
  params?: any;
  title?: any;
}

export interface HitOptions extends CommonOptions {
  referer?: string;
  callback?: () => void;
  title?: string;
}

export interface ExtLinkOptions {
  callback?: () => void;
  title?: string;
  ctx?: any;
  referer?: any;
  params?: { order_price: number; currency: string };
}

export interface YandexMetrika {
  reachGoal: (target: string, params?: any, callback?: () => void, ctx?: any) => void;
  addFileExtension: (extensions: string | string[]) => void;
  extLink: (url: string, options?: ExtLinkOptions) => void;
  getClientID: () => string;
  setUserID: (userId: string) => void;
  notBounce: (options: CallbackOptions) => string;
  userParams: (parameters: any) => void;
  replacePhones: () => void;
  hit: (url: string, options?: ExtLinkOptions) => void;
}
