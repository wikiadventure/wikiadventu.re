<template>
  <section class="wikiPage absolute-full" :id="endPage ? 'endPage' : 'wikiPage'">
    <div id="wikiCore">
      <exit-btn v-if="endPage" target="wiki-end-page"/>
      <h1 id="wikiTitle">{{ title }}</h1>
      <div id="wikiMain">
        <div id="wikiContent" v-html="content"></div>
        <!--<aside id="wikiInfobox" v-if="infobox" v-html="infobox"></aside>-->
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.wikiPage {
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px;
  overflow-wrap: break-word;
  opacity: 1;
  transition: opacity ease-in-out 0.1s;
}
#wikiTitle {
  text-align: center;
}
#wikiCore {
  width: 100%;
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
}   
.infobox, .infobox_v2, .infobox_v3 {
    display: table;
    font-size: 0.9em;
    line-height: 1.4;
    max-width: 16em;
    min-width: 30%;
    float: right;
    clear: right;
    margin: 15px 0 15px 15px;
    border: 1px solid grey;
    border-radius: 5px;
    border-collapse: collapse;
    @media(max-width: 720px) {
      display: flex;
      flex: 1 1 100%;
      flex-flow: column nowrap;
      width: 100% !important;
      max-width: 100% !important;
      th {
        padding: 7px 10px;
      }
      > tbody, > caption {
        display: flex;
        flex-flow: column nowrap;
      }
      > tbody > tr {
        min-width: 100%;
        display: flex;
        flex-flow: row nowrap;
      }
      td:only-child, th:only-child {
        width: 100%;
      }
      tbody > tr > td, tbody > tr > th {
        flex: 1 0;
      }
    }
    caption, tr {
      border-bottom: 1px solid grey;
    }
    th {
      text-align: left;
    }
    caption, tr, th, td {
      border: 1px solid grey;
    }
  }
#wikiContent {
  .hatnote {
    padding: .5em 1.5em;
    display: inline-block;
    font-size: .85em;
    line-height: 1.4;
    margin-bottom: 1em;
    border-radius: 2em;
  }
  .tleft, .floatleft {
    float: left;
    clear: left;
    margin: 0 1.2em 1.2em;
  }
  .tright, .floatright {
    float: right;
    clear: right;
    margin: 0 1.2em 1.2em;
  }
  .tleft {
    margin-left: -.95 * 4em;
    @media screen and (max-width: 1220px) {
      margin-left: -.95 * 2em;
    }
  }
  .tright {
    margin-right: -.95 * 4em;
    @media screen and (max-width: 1220px) {
      margin-right: -.95 * 2em;
    }
  }
  .thumbcaption {
    font-size: .8em;
    padding-right: .5em;
  }
  .thumbinner {
    max-width: 100%;
  }
  .gallerycaption {
    text-align: center;
    font-weight: bold;
  }
  .gallerybox {
    display: inline-block;
    vertical-align: top;
    img {
      display: block;
    }
  }
  .gallerytext {
    font-size: .8em;
    p {
      margin-top: .3em;
    }
  } 
  .reflist {
    font-size: .8em;
  }
}
.body--dark {
  .infobox, .infobox_v2, .infobox_v3 {
    background: var(--w-color-dark-blue);
  }
  .wikiPage {
    background: var(--w-color-almost-black);
    color: var(--w-color-blue-white);
    a {
      color: var(--w-color-dark-teal);
    }
    .notWikiLink {
      filter: grayscale(0.75);
    }
    .portal {
      filter: hue-rotate(-35deg);
    }
    .anchorLink {
      filter: hue-rotate(45deg);
    }
  }
  #wikiContent {
    .hatnote {
      background-color: var(--w-color-dark-blue);
      color: var(--w-color-teal);
    }
  }
}
.body--light {
  .wikiPage {
    .notWikiLink {
      filter: grayscale(0.25);
    }
    .portal {
      filter: hue-rotate(-90deg);
    }
    .anchorLink {
      filter: hue-rotate(25deg);
    }
  }
}    
</style>
<script lang="ts">
import Vue from 'vue';
import ExitBtn from '../../components/ExitButton.vue';
import { defineComponent } from '@vue/composition-api';
import WikiArticle from '../../mixins/wikiArticle';

import scrollToID from '../../mixins/scrollToID';
import { resolve } from 'dns';

export default defineComponent({
  name: 'WikiPage',
  components: { ExitBtn },
  props: {
    endPage:Boolean
  },
  data():{
    title:string,
    content:string,
    loading:boolean,
    //infobox?:string,
    unsubscribe:() => void
  } {
    return {
      unsubscribe: () => {},
      title: "",
      content: "",
      loading: false
    }
  },
  meta () {
    var vm = this as any;
    return {
      title: "Wiki Adventure : " + vm.title
    }
  },
  methods: {
    async requestWikiPage(url:string) {
      var vm:any = this;
      if (vm.loading) return;
      vm.loading = true;
      var id = vm.endPage ? "endPage" : "wikiPage";
      await vm.fetchArticle(url).then(
        function(article:WikiArticle) {
          document.getElementById(id).style.opacity = "0";
          setTimeout(function() {
            vm.title = article.title;
            vm.content = article.content;
            Vue.nextTick().then(function () {
              vm.loading = false;
              vm.redirectLinks(document.getElementById(id));
            });
            document.getElementById(id).style.opacity = "1";
          }, 100);
        }
      ).catch((e:any) => {
        vm.loading = false;
        document.getElementById(id).style.opacity = "1";
        this.$q.notify({
          type: 'negative',
          position: 'bottom-right',
          message: 'A problem occurs when fetching wikipedia article : ' + e
        });
      }); 
    },
    redirectLinks(doc:Document) {
      var vm = this;
      var links = doc.getElementsByTagName("a");
      for (var i=0;i<links.length;i++) {
        links[i].addEventListener("click",function(e){
          e.preventDefault();
          vm.onLinkClick(this);
        });
        if (links[i].getAttribute("href") == undefined) continue;
        if (links[i].getAttribute("href")!.startsWith("#")) {
          links[i].classList.add("anchorLink");
        } else if (links[i].getAttribute("href")!.indexOf(":") != -1) {
          links[i].classList.add("portal");
        } else if (links[i].getAttribute("href")!.startsWith("/wiki/")) {
          links[i].classList.add("wikiLink");
        } else {
          links[i].classList.add("notWikiLink");
        }
      }
    },
    onLinkClick(link:HTMLAnchorElement) {
      var vm = this;
      var linkHref = link.getAttribute("href");
      if (linkHref == undefined) return;
      //check if the link go to another wikipage and not info page or external
      if (!vm.endPage &&
          linkHref.lastIndexOf(":") == -1 &&
          !link.classList.contains("internal") &&
          !link.classList.contains("external") &&
          link.rel != "mw:ExtLink" &&
          !link.classList.contains("new") &&
          linkHref!.startsWith("/wiki/")) {

        var url = linkHref.substring(6);
        var anchor = url.indexOf("#");
        var anchorId = "";
        if (anchor != -1) url = url.substring(0, anchor);
        url = decodeURIComponent(url);
        vm.$store.dispatch('gameData/validateJump', url);
        vm.requestWikiPage(url).then(() => vm.scrollToAnchor(url.substring(anchor+1)));
      } else if (linkHref.startsWith("#")) {
        vm.scrollToAnchor(linkHref.substring(1));
      }
    },
    async fetchArticle(url:string) {
      var vm = this;
      var article = new WikiArticle(url, this.$store.state.gameData.lang, this.$q.platform.is.mobile);
      return await article.fetch();
    },
    scrollToAnchor(id:string) {
      scrollToID(id, this.endPage ? "endPage" : "wikiPage");
    },
  },
  created() {
    var vm = this;
    vm.title = vm.endPage ? vm.$t("wikiPage.noEndPageYet") as string : vm.$t("wikiPage.tipsTitle") as string;
    vm.content = vm.endPage ? "" : vm.$t("wikiPage.tipsContent"+ (vm.$q.platform.is.mobile ? "Mobile" : "")) as string;
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'gameData/voteResult') {
        this.requestWikiPage(vm.endPage ? state.gameData.endPage : state.gameData.startPage);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe!();
  }
});
</script>