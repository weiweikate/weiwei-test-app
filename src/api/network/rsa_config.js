// todo if this environment is app ,please import rsa_key from your package @andriod @ios
// this is a example of ios
// import { NativeModules } from 'react-native';

import {
    currentVersion

} from 'react-native-update';
import {
    Platform
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default {
    version: DeviceInfo.getVersion(),
    client: Platform.OS,
    rsa_key: Platform.OS === 'ios'
        ?
        'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCKGaNlyPmvTbbY6b8RcpgYJiu8Ewi6ygBD3mWuNv2l/+Wq8IvKPnmXIxm644obXbcLv5QrYBaFHBHswny3xHQemNqgIkYJ+Cbc0eZqKuXdbjMeJ8cdFmRPUZHpbFxVoWBvcCxIX3cvscJRkTwCt2TeWCOazGo6lc6dXokEacDXDUjXGTEJqs4X1pV5ON37nTrx7RhpgeBYKOUX/Ow+ON1fZvWONcmPJXzlFHgUTbIc23CV2X9d4sYZZQHjED1+mZ5oRZZpEUXX/yxI0tv94R+zD7+0I+SsIDlunnypWBT74/lCcHW+nCODp2ostDXMhTB2SDLXy+70yYnZqHw0398jAgMBAAECggEAUpPKFM78HksGDuaWjcRMFgSdGjT3f1nSlsKhYm8XdO9zUafMrv50jl86v3nX101OawP/gYBPdwC15zDUir46ASG9eQuFfeiYtGn+sXU9Rg7jGiEG+umsyZEpAr7852c71uboU85h4m8UltmVXLp04k8p2yJoUufJSGiC3dSurugo9G31sqRI1f1IMbwdDosd6SODBk0MgmBzVOEDj786U8LlGTXQjyn/T909bLlTkszMeGBtDWnVfeFqmENpQ+0sJU+UyQQGZWKiklxcCCAv6dtci/W6/h2gMdbkMmYKAaV39Q1V9TBNaRVkL9+GuIL1tDu2kFpi8AtwHDQJuT3kAQKBgQDnUhJftK4vQus0bcxF/9kPC+6nN3d5pzIbozbAw3la0hj7qr8GzL0OQbiiQsiS8Irdf7XYsetpjSUABwAjwPps8NbatJJ8kmfgEn7E2UfufCTAAhW5u9pCeFFIPVvNhCstCvYGm1IoZT9R5fo2kH6zl79JkimvnRS4KtXLGoJqgQKBgQCY1X1HfWx9AQo5kWSbDKvrYXN0CCcttFrNmiodrXmmVMbFhb24MkF0nB3zLR2J6kfaDJHVdZiX8bjAwfi63YmOhudPwZuB5n7dszZ+vzyqAJJFLkpubzyzDXWJcR5ZwtL+/3I1omYbQAtZfVdPvfy6BRFl/gEG9p2+sDur3liPowKBgFIc8CjJGovsVVHnJ/wxNfwBYFY7ek3U7BSje2wx94Il0niDxAvF4daNvdzbmBeRC7pU+1hQ0CBH2jqIQaRvfHXviFVahCV0UytXZWi7OK2Po/wEwXGNHY066J+cKFpr8Ges3Gi7+g4c4r1PxeJYqKFX3K9hEysjt5conXvbjTABAoGBAIbhy4n/cHK2Kz75SS/ptAStYcZit6kHhif0Sf0dL8KTCUYjrXdVqxzt9yS5iVtBT55p/37DJSPcKjC8P/czM4Z9GsHx3Xt8YDTrSEn+HtzuWikCHKBwPcLMOxJMqfuQDMUNzs70/2ZHVHzrONZglx3ZASzhSijKGBfF0zPwrHo/AoGBAMuSgVj+/UxlvftQt8SV2YHJCw3mwQcYueeRTqEaF8Dapoz/7RATI6W2ZeEVUyaNQl+WDP/XOgVctCoXd9gW/MWGNEv2iGwImelJOuhXyhK41rzq5S7bR+HzrWBiabz78uNlhE0VUisuXkErBzrSHZcoIyk3QmK05b83V1cUEjvY'
        :
        'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtj/qiItQ9Na5TdxTxVfFns0yAVTTiOFTesI6DQXseZ5nbnR56BsKpFSnGVI/ZDr+8VDdbMZJVNVLzv7FtGicRKcii9tQeuDIH2FWkRUpzmTWltqtc+IT22tynU4KQbeeGACn4LyRqOmi/eBM5pR+nNvq561vp54hzmlF+LVqRyYgjOl6CHfSHzkn3+E9nNqSNGN/bu/OuDW2YXs+vJWgS4l6HnSZ0XQL1Ybj0OWvmkqONqcwKFnrAaFxq4vYvYEMTl9PNl33e0ZGP/UIRG0JwujBdJx+BJQAN0SEELFeses32E7hzPxbwnGAH6F7ehtoFcxSV757Uzhy1CiQVoem3AgMBAAECggEAXkZMr3EXs7/K1w9h0s0J+XgM39Boj1Bl2Sgx4N3akGNZ0U6A1WuCpPEX5eDc2dwHDbb48pH0mFAEpN3E9Cw2eD4n+0zzX1RR6Kz7p+TzUeMwnrigUDm1j5jGLiVQUD9CeSjxoxuIPiNH7mi8mJ02mk9k1UQggub+2TxDc7QS9AiL+IfR1BGfvSUtkE7N3q6sDedu2nqEJVXWF89lWiDzHxtenk97Luv67a0zYfYrT624Q40nBV1NV8Xl4t3AGBRghhMIDsEdPc/ViXx2D2OMJTieQGYxokvNjkdnPJ/K5vOxAD8MovK5hqYgVo+NVwcN1Nqm1iDirc8uPC0z5UkLYQKBgQDmyyZ3QyOjqbd4bmO9K5rZoJi6lRqiw6ce6xkxy6MEtmogdlVoks9Hf8rplfrRfaqLJMhlvbno3+9K6fTpEeYLgQvjIbH0ivwmSMYE8xEJBdE2RbGJj0SDkl1hrq/JJsDeAbMVn2Q14x8JpcmuKFZSpc6fSUhrE+hNLRTd9hsMWQKBgQDAhK4vctih9387lfJq/F0FTLJWE9Wi5hlru5J4YbdsSuPtvd+dGYXzxUTguEjG7P26QCNa6vHCAim4gvXiCi/IFn94IWkJ5z/8cvCJN81qwnPu6Ks0ZZ6dLH91YJF8tgiystWl/eaN97O9luuIAQyjMM72MVeWXx/NSr+yheWkjwKBgEitpLld3TVG1s4IBUSnHKZ32mC3X6Ht9wzXgCGcPQPY5ea/HPpHcRrU9XNFlayu5CvZM3pGmuroyhRPRJ640jbBNpsaG04lDm6H8EPSv4SV3mI25EerZCoCx4FhX1365DWFV33xqb8GfNmu6an8beKs8Dpc+38sz7SuA6o6PB5RAoGBAJrFT/+HVc+IWHo/xx7peaL8ENcQpQyL7d3lcxBihoKCBpGntvDmhwD+E6yRmriJ6EVmsMWz4d31vTK/3gr144n5REsAmSBED/XVNbkq6nKsl2V3GcRK+eQj1Og5VV0sPvvit831u/dgLtj5TqsNJOrBH3FfI6oZGUkCkfBkosTTAoGBALRR/oI4Cf2LNUIc8xhjDHkGlCbeOfjPmO6znAw4FquOMyBnWJNKKhu1r/oBxuYewdfcjMxPFs86OyZLCUSHYDJV2+l0FtbG5b+F4EMAc4c7ilPtfzYAa5bV5xq/4N3pWoXQHe0vRvb5tTNIudAC/fCz18bSYf6CM35G/oNbF3Fz',
    hotVersion: currentVersion
};
