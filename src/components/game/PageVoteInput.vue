<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import WikiTitleInput from '../wiki/WikiTitleInput.vue';

const { store, my_player_round_data } = useGameStore();

watch(() => store.gamedata.wiki_lang, (newWikiLang, _oldValue) => {
    if (newWikiLang != my_player_round_data.value.page_vote?.wiki_lang) {
        my_player_round_data.value.page_vote = null;
    }
});

const my_player_vote = computed({
    get() {
        return my_player_round_data.value.page_vote;
    },
    set(newValue) {
        console.log({newValue});
        console.log(my_player_round_data.value.page_vote);
        my_player_round_data.value.page_vote = newValue;
    }
});

</script>
<template>
<WikiTitleInput placeholder="Your wiki page" class="page-vote-input" v-if="store.gamedata.wiki_lang != null && my_player_round_data != null" :wiki-lang="store.gamedata.wiki_lang" v-model="my_player_vote"/>
</template>
