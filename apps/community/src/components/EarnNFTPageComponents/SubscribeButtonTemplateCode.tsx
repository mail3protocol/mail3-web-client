import { SubscriptionRewardType } from '../../api/modals/SubscriptionResponse'
import { APP_URL } from '../../constants/env/url'

export const subscribeButtonTemplateCode = (
  communityId: string,
  address: string,
  opt?: {
    type: SubscriptionRewardType
  }
) =>
  // language=html
  `<a href="${APP_URL}/subscribe/${communityId}?utm_medium=click_subscribe_button&utm_campaign=${address}&reward_type=${opt?.type}" target="_blank">
  <img src="${APP_URL}/images/subscribe-btn-${opt?.type}.png" alt="subscribe" style="width: 178px; height: auto; margin: auto">
</a>
`

// language=css
export const subscribeButtonTemplateCssCode = `html, body{
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
`
