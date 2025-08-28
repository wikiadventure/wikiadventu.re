<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useGameStore } from '../../stores/useGameStore';
import WikiTitleInput from '../wiki/WikiTitleInput.vue';

const { store, my_player_round_data, current_round } = useGameStore();

const round_wiki_lang = computed(() => current_round.value?.wiki_lang ?? store.gamedata.wiki_lang);

watch(() => round_wiki_lang.value, (newWikiLang, _oldValue) => {
    if (newWikiLang != my_player_round_data.value.page_vote?.wiki_lang) {
        my_player_round_data.value.page_vote = null;
    }
});

const my_player_vote = computed({
    get() {
        return my_player_round_data.value.page_vote;
    },
    set(newValue) {
        my_player_round_data.value.page_vote = newValue;
    }
});

</script>
<template>
<WikiTitleInput placeholder="Your wiki page vote" class="page-vote-input" v-if="round_wiki_lang != null && my_player_round_data != null" :wiki-lang="round_wiki_lang" v-model="my_player_vote"/>
</template>
