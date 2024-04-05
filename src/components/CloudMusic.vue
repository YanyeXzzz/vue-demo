<template>
    <a-input placeholder="please input SongName" :style="{ width: '200px', marginRight: '20px' }"
        v-model:value="searchSong"></a-input>
    <a-button type="primary" @click="getSongs">Search</a-button>
    <a-table :data-source="data" :columns="columns">
        <template #bodyCell="{ column, index }">
            <template v-if="column.key === 'action'">
                <a-button type="primary" @click="play(index)" shape="circle" style="margin-right: 10px;">
                    <template #icon>
                        <PlayCircleTwoTone />
                    </template>
                </a-button>
                <a-button type="primary" @click="save(index)" shape="circle">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                </a-button>
            </template>
        </template>
    </a-table>

    
</template>
<script setup>
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { PlayCircleTwoTone, DownloadOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
const data = ref([

])

const columns = [
    {
        title: '歌曲名',
        dataIndex: 'songName',
        key: 'name',
    },
    {
        title: '歌手',
        dataIndex: 'singerName',
        key: 'singer',
    },
    {
        title: '时长',
        dataIndex: 'songTime',
        key: 'time',
    },
    {
        title: 'ID',
        dataIndex: 'songId',
        key: 'id',
    },
    {
        title: '',
        key: 'action'
    }
];

const audio = ref('')

const searchSong = ref('')


// 
/**
 * 网易云外链
 * http://music.163.com/song/media/outer/url?id=
 */
const getSongs = () => {
    data.value = []
    const search = searchSong.value
    const url = '/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=' + search + '&type=1&offset=0&total=true&limit=10'
    axios.get(url)
        .then(response => {
            const songs = response.data.result.songs

            songs.forEach(element => {
                data.value.push({
                    songName: element.name,
                    singerName: element.artists[0].name,
                    songTime: '',
                    songId: element.id
                })
            });
        })
        .catch(error => {
            console.log(error)
        })
}

const play = (index) => {
    const songInfo = data.value[index]
    window.open('http://music.163.com/song/media/outer/url?id=' + songInfo.songId, '_blank')
}

const save = (index) => {
    const songInfo = data.value[index]
    axios.post('http://localhost:9090/save',songInfo)
        .then(response => {
            if(response.data.code === 0){
                message.success(response.data.data)
            }
            else{
                message.error(response.data.message)
            }
        })
        .catch(error => {
            console.log(error)
        })


}



</script>
<style scoped>
.highlight {
    background-color: rgb(255, 192, 105);
    padding: 0px;
}
</style>