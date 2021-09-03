<template>
  <section class="wikiPage absolute-full" :class="{ wikifade: fade, disabled: disabled }">
    <slot></slot>
    <div id="wikiCore" ref="wiki">
      <h1 id="wikiTitle">{{ wikiArticle.title || title }}</h1>
      <div id="wikiMain">
        <div id="wikiContent" v-html="wikiArticle.doc?.body.innerHTML || content" :class="{ safeMode: safeModeActive }"></div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
@use '../../css/wiki' as *;

.wikiFade {
  opacity: 0;
}
.disabled a:not(.anchorLink) {
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
  --wiki-page-bg: var(--clr-main);
  --wiki-page-color: var(--clr-reverse);

  --wiki-link-color: var(--clr-teal);
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
import { nextTick, reactive, ref } from 'vue';
import ExitBtn from 'src/components/ExitButton.vue';
import { defineComponent } from 'vue';
import WikiArticle from 'store/wiki/wikiArticle';
import { scrollToID } from 'src/script/scrollToID';
import { settingSetup } from 'store/setting';
import { sendValidate } from 'store/ws/packetSender/vanilla/validate';
import { lang } from 'store/lobby/state';
import { Notify, useMeta, useQuasar } from 'quasar';

export default defineComponent({
  name: 'WikiPage',
  components: { ExitBtn },
  props: {
    disabled:Boolean,
    //title:String,
    //content:String
  },
  setup(props) {
    const $q = useQuasar();

    const {
      safeModeInterrupted,
      safeModeActive
    } = settingSetup();

    const wiki = ref<HTMLElement>();
    const wikiArticle = reactive<WikiArticle>(new WikiArticle());
    const loading = ref(false);
    const fade = ref(false);
    const title = ref("");
    const content = ref("");

    props.disabled || useMeta(() => {
      return {
        title: wikiArticle.title || "Wiki Adventure"
      }
    })

    async function requestWikiPage(url:string) {
      if (loading.value) return;
      loading.value = true;
      safeModeInterrupted.value = true;
      await fetchArticle(url)
        .then(a => {
          fade.value = true;
          setTimeout(() => {
            nextTick().then(() => {
              loading.value = false;
              redirectLinks(wiki.value);
            });
            fade.value = false;
          }, 100);
        }
      ).catch(e => {
        loading.value  = false;
        fade.value  = false;
        //TODO: must translate this
        Notify.create({
          type: 'negative',
          position: 'bottom-right',
          message: 'A problem occurs when fetching wikipedia article : ' + e
        });
      }); 
    }

    function redirectLinks(doc?:HTMLElement) {
      if(!doc) return;
      var links = doc.getElementsByTagName("a");
      for (var i=0;i<links.length;i++) {
        links[i].addEventListener("click",function(e){
          e.preventDefault();
          onLinkClick(this);
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
            if (wikiArticle.links.find(l => l.title == d && l.ns == 0)) {
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
    }

    function onLinkClick(link:HTMLAnchorElement) {
      var linkHref = link.getAttribute("href");
      if (linkHref == undefined) return;
      //check if the link go to another wikipage and not info page or external
      if (!props.disabled && link.classList.contains("wikiLink")) {
        var url = linkHref.substring(6);
        var anchor = url.indexOf("#");
        if (anchor != -1) url = url.substring(0, anchor);
        url = decodeURIComponent(url);
        sendValidate(url);
        requestWikiPage(url).then(() => {
          if (anchor != -1) scrollToAnchor(url.substring(anchor+1));
          else wiki.value?.scrollTo(0,0);
        });
      } else if (linkHref.startsWith("#")) {
        scrollToAnchor(linkHref.substring(1));
      }
    }

    async function fetchArticle(title:string) {
      safeModeInterrupted.value = false;
      return await wikiArticle.fetch(title, lang.value, $q.platform.is.mobile);
    }
    
    function scrollToAnchor(id:string) {
      scrollToID(id, wiki.value);
    }

    return {
      safeModeActive,
      wiki,
      wikiArticle,
      loading,
      fade,
      title,
      content,
      requestWikiPage,
      redirectLinks,
      onLinkClick,
      fetchArticle,
      scrollToAnchor

    }
  }
});
</script>