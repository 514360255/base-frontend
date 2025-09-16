/*
 * @Author: 郭郭
 * @Date: 2025/9/16
 * @Description:
 */
import { IApi } from 'umi';
export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('script').attr('src', (index, src) => {
      // if (src.includes('umi')) {
      //   $('script').eq(0).attr('defer', 'ture');
      // }
      $('script').eq(index).attr('defer', 'ture');
      return src;
    });
    return $;
  });
};
