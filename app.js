
// -- start db --
class Task
{
    constructor(title, section, content, index){
        this.title = title;
        this.section = section;
        this.content = content;
        this.index = index;
        this.favorite = false;
        this.done = false;
    }

    setSection(section){
        this.section = section;
    }

    toggleFavorite(){
        if(this.favorite) this.favorite = false;
        else this.favorite = true;
    }

    toggleDone(){
        if(this.done) this.done = false;
        else this.done = true;
    }
}

class Section
{
    static sectionLists = {};
    static allSections = [];
    static counter = 0;

    static createSection(section_name){
        if(Section.sectionLists[section_name] == null){
            Vue.set(Section.sectionLists, section_name, {});
            // Section.sectionLists[section_name] = {};
            Section.allSections.push(section_name);
        }
        console.log(Section.sectionLists);
    }

    static addTask(taskObj){
        console.log(Section.sectionLists);
        console.log(taskObj.section);
        console.log(Section.sectionLists[taskObj.section]);

        Vue.set(Section.sectionLists[taskObj.section], taskObj.index, taskObj);
    }

    static createTask(title, section, content){
        let taskObj = new Task(title, section, content, Section.counter);
        Section.counter++;
        return taskObj;
    }
}

// -- end db --

let modal_template = {
    template: '#modal-template',
    data(){
        return {
            sectionLists: Section.sectionLists,

            registeredTitle: '',
            registeredSection: "Select a section",
            registeredContent: '',
            registerBtn: true,
        }
    },
    props: {
        section: {
            required: true,
        }
    },
    methods: {
        addTask(){
            Section.addTask(Section.createTask(this.registeredTitle, this.registeredSection, this.registeredContent));
            this.registeredTitle = '';
            this.registeredSection = 'Select a section';
            this.registeredContent = '';
            this.closeModal();
        },
        closeModal(){
            this.$emit('close')
        },
    },
    computed: {
        toggleRegiBtn(){
            if(this.registeredTitle.length > 0 && this.registeredSection != "Select a section" && this.registeredContent.length > 0) {
                this.registerBtn = false;
                return this.registerBtn;
            }
            
            this.registerBtn = true;
            return this.registerBtn;
        }
    }
}

let card_template = {
    template: '#task-card-template',
    data(){
        return{
            selectedSection: '',
            favorite: '',
            done: '',
            sectionLists: Section.sectionLists,
            allSections: Section.allSections,
        }
    },
    props: {
        index: {
            required: true,
            type: Number,
        },
        title:{
            required: true,
            type: String,
        },
        section :{
            required: true,
            type: String,
        },
        content: {
            required: true,
            type: String,
        },
        favorite: {
            required: true,
            type: Boolean,
        },
        done: {
            required: true,
            type: Boolean,
        },
    },
    methods: {
        select(section){
            this.selectedSection = section;
            console.log(this.selectedSection);
        },
        updateSection(index, preSection){
            console.log(index);
            console.log(preSection);
            console.log(this.selectedSection);
            
            let temp = Section.sectionLists[preSection][index];
            console.log(temp);
            temp.setSection(this.selectedSection);

            this.$set(Section.sectionLists[this.selectedSection], index, temp);
            this.$delete(Section.sectionLists[preSection], index);
            this.$emit('toSection_name', preSection);
            this.select(this.selectedSection);
        },
        removeTask(index, section){
            console.log('works');
            // Section.remove(index, section);
            this.$delete(Section.sectionLists[section], index);
        },
        toggleFavorite(){
            this.$emit('toggleFavorite');
        },

        toggleDone(){
            this.$emit('toggleDone');
        }
    },
    computed: {
        getFavorite(){
            return this.favorite;
        },

        getDone(){
            return this.done;
        }
    }
};


let section_template = {
    template: '#section-list-template',
    components: {
        card_template : card_template,
        modal_template: modal_template,
    },
    props : {
        section :{
            type: String,
            required: true,
        },
        sec_obj: {
            type: Object,
            reuqired: true,
        },
    },
    data(){
        return {
            showModal: false,
            section_name: '',
        }
    },
    methods: {
        toggleModal(){
            if(this.showModal) this.showModal = false;
            else this.showModal = true;
        },
        getSection(section){
            this.section_name = section;
            return this.section_name;
        },
        emitSection(currsec){
            this.section_name = currsec;
        }
    }
};

var app = new Vue({
    el: '#app',
    data: {
        section_disabled: false,
        section_name: '',
        sectionLists: '',
        sectionCount: 0,
    },
    components: {
        section_template: section_template,
    },
    methods: {
        toggleSectionInput(){
            if(this.section_disabled){
                this.section_disabled = false;
            } else {
                this.section_disabled = true;
            }
        },
        addSection(){
            Section.createSection(this.section_name);
            this.section_name = '';
            this.sectionCount++;
        },
    },
    computed: {
        getAllLists(){
            this.sectionLists = Section.sectionLists;
            return Section.sectionLists;
        }
    },
});