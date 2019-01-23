<template>
    <div class="grid__cell grid__cell_uploader">
        <uploader
            class="fb-uploader"
            :options="uploaderOptions"
            @file-added="checkFile"
            @file-success="addFileNameToForm"
            @upload-start="toggleFormBlock(true)"
            @complete="toggleFormBlock(false)"
        >
            <uploader-unsupport></uploader-unsupport>

            <!-- dropzone -->
            <uploader-drop>
                <p class="fb-uploader__message">
                    {{ $lang.FORMS_UPLOAD_DROP }} 
                    <span class="fb-uploader__fakebtn">{{ $lang.FORMS_UPLOAD_ADD }}</span>
                    <uploader-btn class="fb-uploader__btn"><span>{{ $lang.FORMS_UPLOAD_ADD }}</span></uploader-btn>
                </p>
                <p v-if="format || size">
                    <i class="fb-uploader__formats" v-if="format">
                        {{ $lang.FORMS_UPLOAD_FORMAT }} {{ formatString }}.
                    </i>
                    <i class="fb-uploader__size" v-if="size">
                        {{ $lang.FORMS_UPLOAD_SIZE }} {{ size }}Mb
                    </i>
                </p>
            </uploader-drop><!-- / dropzone -->

            <!-- files list -->
            <uploader-list>
                <template slot-scope="props">
                    <slot name="list" :file-list="props.fileList" :remove-file="removeFile">
                        <div v-if="props.fileList.length > 0" class="fb-uploader__cwrap">
                            <table class="fb-uploader__list" >
                                <tbody>
                                    <template v-for="(file, i) in props.fileList" :key="file.id">
                                        <tr>
                                            <td class="fb-uploader__list-number">{{ i + 1 }}</td>
                                            <td class="fb-uploader__list-name">
                                                <v-popover
                                                    popover-class="fb-uploader__tooltip"
                                                    placement="top"
                                                    trigger="hover focus"
                                                >
                                                    <abbr>{{ getName(file.name) }}</abbr>
                                                    <span slot="popover">
                                                    {{ getName(file.name) }}
                                                    </span>
                                                </v-popover>
                                            </td>
                                            <td class="fb-uploader__list-type">{{ getExtension(file.name) }}</td>
                                            <td class="fb-uploader__list-size">{{ file.size | bytesToMb }}</td>
                                            <td class="fb-uploader__list-date">
                                                <template v-if="file.isComplete()">
                                                    {{ file._lastProgressCallback | timestampToDate }}
                                                </template>
                                                
                                            </td>
                                            <td class="fb-uploader__list-delete">
                                                <button
                                                    class="fb-uploader__delete"
                                                    :title="$lang.FORMS_UPLOAD_DELETE"
                                                    :aria-label="$lang.FORMS_UPLOAD_DELETE"
                                                    @click.prevent="removeFile(file, i)" >&times;</button>
                                            </td>
                                        </tr>
                                        <tr v-if="!file.isComplete()" class="fb-uploader__list-pgwrap">
                                            <td colspan="6" class="fb-uploader__list-progress">
                                                <progress 
                                                    class="fb-uploader__progress" 
                                                    max="1" 
                                                    :value="file.progress()">
                                                </progress>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </slot>
                </template>
            </uploader-list><!-- / files list -->

        </uploader>
    </div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';

export default {

    name: 'fb-uploader',

    mixins: [ fieldMixin ],


    props: {

        url: {
            type: String,
            required: true
        },

        format: {
            type: [String, Array],
        },

        size: [String, Number], // Mb
        validator(value) {
            return +value == value
        }
    },


    data() {
        return {
            value: []
        }
    },


    filters: {

        timestampToDate(val) {
            let date = new Date(val)
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() + 1}`
        },

        bytesToMb(val) {
            let mb = val / 1024 / 1024
            return ( mb < 1 ? mb.toFixed(3) : mb.toFixed(1) ) + 'Mb'
        }
    },


    computed: {

        uploaderOptions() {
            return {
                target: this.url,
                testChunks: false,
                
            }
        },

        formatArray() {
            return this.format && Array.isArray(this.format) ?
                   this.format :
                   this.format.split(',').map( extension => extension.trim() )
        },
        
        formatString() {
            return this.format && Array.isArray(this.format) ?
                   this.format.concat(', ') :
                   this.format
        },

        maxSizeBytes() {
            return this.size * 1024 * 1024
        }
    },


    methods: {

        checkFile(file) {
            if ( this.format && ! this._extensionMatch(file) ) {
                file.ignored = true
                console.warn('fb-uploader: ' + file.name + ' format missmatch');
            }
            if ( this.size && file.size > this.maxSizeBytes ) {
                file.ignored = true
                console.warn('fb-uploader: ' + file.name + ' is too big');
            }
        },

        getExtension(fileName) {
            return fileName.split('.').pop()
        },
        
        getName(fileName) {
            let name = fileName.split('.')
            name.pop()
            return name.join('.')
        },

        _extensionMatch(file) {
            let extension = this.getExtension(file.name)
            return this.formatArray.includes(extension)
        },

        toggleFormBlock(isBlocked) {
            this.$awesForms.commit('toggleFormBlocked', {
                id: this.formId,
                isBlocked
            })
            if ( ! isBlocked ) this.$forceUpdate()
        },

        addFileNameToForm(rootFile, file, message, chunk) {
            try {
                let response = JSON.parse(message)
                let fileName = _.get(response, 'meta.img', file.relativePath)
                this.value.push(fileName)
            } catch(e) {
                console.log(e);
            }
        },
        
        removeFile(file, index) {
            if ( file.isComplete() ) {
                this.value.splice(index, 1)
            }
            file.cancel()
        }
    }
}
</script>
