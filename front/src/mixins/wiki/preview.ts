
import { computed } from "@vue/composition-api";
import { i18n } from "src/boot/i18n";
import { Store } from "src/store";
import { WikiPreview } from "src/store/gameData/state";

export default function () {
  function pagePreview(end:Boolean = false):WikiPreview {//t should be either
    let v = end ? Store.state.gameData.endPage : Store.state.gameData.startPage;
    let t = end ? "end" : "start";
    return {
      title: i18n.t('gameTab.'+t) + " : " + ( v.title || "" ),
      description: v.description,
      thumbnail: v.thumbnail
    };
  };
  const startPage = computed(() => pagePreview());
  const endPage = computed(() => pagePreview(true));
  return {
    pagePreview,
    startPage,
    endPage
  }
}