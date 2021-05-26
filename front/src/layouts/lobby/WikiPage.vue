<template>
  <section class="wikiPage absolute-full" :class="{ 'wikifade': fade, 'endPage': endPage }">
    <exit-btn class="q-ma-md" v-if="endPage" target="wiki-end-page"/>
    <div id="wikiCore" ref="wiki">
      <h1 id="wikiTitle">{{ title }}</h1>
      <div id="wikiMain">
        <div id="wikiContent" v-html="content" :class="{ safeMode: safeMode }"></div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
@use '../../css/wiki' as *;

.wikiFade {
  opacity: 0;
}
.endPage a:not(.anchorLink) {
  cursor: not-allowed;
}
.wikiPage {
  overflow-wrap: break-word;
  opacity: 1;
  transition: opacity ease-in-out 0.1s;
}
#wikiTitle {
  text-align: center;
}
#wikiCore {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  padding: 15px;
  h1 {
    font-size: 4rem;
    margin: 20px auto;
  }
  h2 {
    font-size: 2rem;
    margin: 10px auto;
  }
  h3 {
    font-size: 1.8rem;
    margin: 7px auto;
  }
  h4 {
    font-size: 1.5rem;
    margin: 5px auto;
  }
  ul {
    margin: 0.3em 0 0 1.6em;
    padding: 0;
  }
  img {
    max-width: 100%;
    height: auto;
  }
}
#wikiMain {
  width: 100%;
  padding: 2em 4em;
  @media screen and (max-width: 1220px) {
    padding: .5em 2em;
  }
  @media screen and (max-width: 720px) {
    padding: 0 0;
  }
  >>> ul {
    list-style-type: disc;
    padding-left: 2.5em;
    margin: 1em 0;
  }
  .safeMode {
    img {
      filter: blur(5px);
      transition: filter 2s ease-in-out;
    }
    img:hover {
      filter: blur(0px);
    }
  }
}
.body--dark {
  --wiki-page-bg: var(--wa-color-almost-black);
  --wiki-page-color: var(--wa-color-blue-white);

  --wiki-link-color: var(--wa-color-dark-teal);
  --not-wiki-link-color: #8e3a45;
  --portal-link-color: #168243;
  --anchor-link-color: #26488f;
}
.body--light {
  --wiki-page-bg: white;
  --wiki-page-color: black;

  --wiki-link-color: #2b2bc7;
  --not-wiki-link-color: #8e3a45;
  --portal-link-color: #168243;
  --anchor-link-color: #2593ce;
}
.wikiPage {
  background: var(--wiki-page-bg);
  color: var(--wiki-page-color);
}
#wikiContent {
  .hatnote {
    background-color: var(--hatnote-bg);
    color: var(--hatnote-color);
  }
  .wikiLink {
    color: var(--wiki-link-color);
  }
  .notWikiLink {
    color: var(--not-wiki-link-color);
  }
  .portalLink {
    color: var(--portal-link-color);
  }
  .anchorLink {
    color: var(--anchor-link-color);
  }
}
</style>
<script lang="ts">
import Vue from 'vue';
import ExitBtn from 'src/components/ExitButton.vue';
import { defineComponent } from '@vue/composition-api';
import WikiArticle from 'src/mixins/wikiArticle';

import scrollToID from 'src/mixins/scrollToID';

export default defineComponent({
  name: 'WikiPage',
  components: { ExitBtn },
  props: {
    endPage:Boolean
  },
  data():{
    wikiArticle:WikiArticle,
    title:string,
    content:string,
    loading:boolean,
    fade:boolean,
    safeModeActive:boolean,
    unsubscribe:() => void
  } {
    return {
      unsubscribe: () => {},
      wikiArticle: null,
      title: "",
      content: "",
      loading: false,
      fade: false,
      safeModeActive: false//use to temporarily disable safemode ( for one page )
    }
  },
  meta () {
    var vm = this as any;
    if (!vm.endPage) return;
    return {
      title: "Wiki Adventure : " + vm.title
    }
  },
  computed: {
    safeMode: {
    get():boolean {
      return this.$store.state.gameData.safeMode && this.safeModeActive;
    },
    set(b:boolean) {
      this.$store.commit('gameData/volume', b);
      this.safeModeActive = b;
    }
  }
  },
  methods: {
    async requestWikiPage(url:string) {
      var vm:any = this;
      if (vm.loading) return;
      vm.loading = true;
      vm.safeModeActive = true;
      await vm.fetchArticle(url).then(
        function(article:WikiArticle) {
          vm.fade = true;
          setTimeout(function() {
            vm.title = article.title;
            vm.content = article.content;
            Vue.nextTick().then(function () {
              vm.loading = false;
              vm.redirectLinks(vm.$refs.wiki);
            });
            vm.fade = false;
          }, 100);
        }
      ).catch((e:any) => {
        vm.loading = false;
        vm.fade = false;
        this.$q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'A problem occurs when fetching wikipedia article : ' + e
        });
      }); 
    },
    redirectLinks(doc:HTMLElement) {
      var vm = this as any;
      var links = doc.getElementsByTagName("a");
      for (var i=0;i<links.length;i++) {
        links[i].addEventListener("click",function(e){
          e.preventDefault();
          vm.onLinkClick(this);
        });
        var href = links[i].getAttribute("href");
        var classes = links[i].classList;
        if (href == undefined) continue;
        if (href!.startsWith("#")) {
          classes.add("anchorLink");
        } else if (href!.startsWith("/wiki/")) {
          if (href!.indexOf(":") != -1) {
            var sub = href.substring(6);
            var d = decodeURI(sub).replace( /\_/g, ' ' );
            if (this.wikiArticle.links.find(l => l.title == d && l.ns == 0)) {
              classes.add("wikiLink");
            } else {
              classes.add("portalLink");
            }
          } else {
            classes.add("wikiLink");
          }
        } else {
          classes.add("notWikiLink");
        }
      }
    },
    onLinkClick(link:HTMLAnchorElement) {
      var vm = this as any;
      var linkHref = link.getAttribute("href");
      if (linkHref == undefined) return;
      //check if the link go to another wikipage and not info page or external
      if (!vm.endPage && link.classList.contains("wikiLink")) {
        var url = linkHref.substring(6);
        var anchor = url.indexOf("#");
        if (anchor != -1) url = url.substring(0, anchor);
        url = decodeURIComponent(url);
        vm.$store.dispatch('gameData/validateJump', url);
        vm.requestWikiPage(url).then(() => {
          if (anchor != -1) vm.scrollToAnchor(url.substring(anchor+1));
          else vm.$refs.wiki.scrollTo(0,0);
        });
      } else if (linkHref.startsWith("#")) {
        vm.scrollToAnchor(linkHref.substring(1));
      }
    },
    async fetchArticle(url:string) {
      this.wikiArticle = new WikiArticle(url, this.$store.state.gameData.lang, this.$q.platform.is.mobile);
      return await this.wikiArticle.fetch();
    },
    scrollToAnchor(id:string) {
      var vm = this as any;
      scrollToID(id, vm.$refs.wiki);
    },
  },
  created() {
    var vm = this as any;
    vm.title = vm.endPage ? vm.$t("wikiPage.noEndPageYet") as string : vm.$t("wikiPage.tipsTitle") as string;
    vm.content = vm.endPage ? "" : vm.$t("wikiPage.tipsContent"+ (vm.$q.platform.is.mobile ? "Mobile" : "")) as string;
  },
  mounted() {
    var vm = this as any;
    function keyDown(e:KeyboardEvent) {
      if (e.defaultPrevented) return;
      if (e.key == "q" && e.ctrlKey) {
        vm.safeModeActive = false;
      }
    }
    document.addEventListener("keydown", keyDown, false);
  }
});
</script>