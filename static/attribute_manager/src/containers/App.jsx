import React, { Component } from 'react'
import MainPage from '../components/MainPage'
import UrlAssembler from 'url-assembler'
import { getCRSFToken } from '../utils'
export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            resourceSelectDialog: {
                open: false,
                resources: [],
                searchValue: '',
            },
            addAttributeDialog: {
                open: false,
                attributeType: 4,
                attributeName: '',
                success: false,
                fail: false,
            },
            deleteAttributeDialog: {
                open: false,
                attributeName: '',
                success: false,
                fail: false,
            },
            resourceSelectInput: {
                selectedResource: undefined,
                errors: {},
            },
            attributeManager:{
                attributes: [],
            },
            publishForm: {
                selectedResource: undefined,
                attributes: [],
                sortByValue: '',
                groupByValue: '',
                outLayerName: '',
                errors: {},
            },
            resultsDialog: {
                open: false,
                errors: undefined,
                success: undefined,
                layerName: undefined
            },
            outLayersDialog: {
                open: false,
                outLayers: [],
                errors: undefined
            }
        }
        // globalURLS are predefined in index.html otherwise use the following defaults
        this.urls = globalURLS
        this.checkedLineFeatures = []
        this.fetchResources = this.fetchResources.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.resourceSelectDialogClose = this.resourceSelectDialogClose.bind(this)
        this.addAttributeDialogClose = this.addAttributeDialogClose.bind(this)
        this.addAttributeDialogOpen = this.addAttributeDialogOpen.bind(this)
        this.onAddAttrChange = this.onAddAttrChange.bind(this)
        this.onAddAttribute = this.onAddAttribute.bind(this)
        this.resourceSelectDialogOpen = this.resourceSelectDialogOpen.bind(this)
        this.resultsDialogClose = this.resultsDialogClose.bind(this)
        this.outLayersDialogClose = this.outLayersDialogClose.bind(this)
        this.resultsDialogOpen = this.resultsDialogOpen.bind(this)
        this.onResourceSelect = this.onResourceSelect.bind(this)
        this.getLayerAttributes = this.getLayerAttributes.bind(this)
        this.publishChange = this.publishChange.bind(this)
        this.onOutLayerCheck = this.onOutLayerCheck.bind(this)
        this.deleteAttributeDialogOpen = this.deleteAttributeDialogOpen.bind(this)
        this.deleteAttributeDialogClose = this.deleteAttributeDialogClose.bind(this)
        this.onDeleteAttrChange = this.onDeleteAttrChange.bind(this)
        this.onAttrDelete = this.onAttrDelete.bind(this)
        this.apply = this.apply.bind(this)
    }
    resourceSelectDialogClose() {
        this.setState({
            resourceSelectDialog: {
                ...this.state.resourceSelectDialog,
                searchValue: '',
                open: false
            }
        }, this.fetchResources)
    }
    resourceSelectDialogOpen() {
        this.setState({
            resourceSelectDialog: {
                ...this.state.resourceSelectDialog,
                open: true
            }
        })
    }
    addAttributeDialogClose() {
        this.setState({
            addAttributeDialog: {
                ...this.state.addAttributeDialog,
                open: false,
                success: false,
                fail: false,
                attributeName: '',
                attribute_type: 4,
            }
        })
    }
    addAttributeDialogOpen() {
        this.setState({
            addAttributeDialog: {
                ...this.state.addAttributeDialog,
                open: true
            }
        })
    }
    deleteAttributeDialogClose() {
        this.setState({
            deleteAttributeDialog: {
                ...this.state.deleteAttributeDialog,
                open: false,
                success: false,
                fail: false,
                attributeName: '',
                attribute_type: 4,
            }
        })
    }
    deleteAttributeDialogOpen() {
        this.setState({
            deleteAttributeDialog: {
                ...this.state.deleteAttributeDialog,
                open: true
            }
        })
    }
    onAddAttrChange(e){
        this.setState({
            addAttributeDialog: {
                ...this.state.addAttributeDialog,
                [e.target.name]: e.target.value,
            },
        })
    }
    onDeleteAttrChange(e){
        this.setState({
            deleteAttributeDialog: {
                ...this.state.deleteAttributeDialog,
                [e.target.name]: e.target.value,
            },
        })
    }
    async onAddAttribute(){
        this.setState({loading: true})
        const attributeName = this.state.addAttributeDialog.attributeName
        const attributeType = this.state.addAttributeDialog.attributeType
        const layerName = this.state.resourceSelectInput.selectedResource.name
        let form = new FormData();
        form.append('layer_name', layerName)
        form.append('attribute_name', attributeName)
        form.append('attribute_type', attributeType)
        form.append('csrfmiddlewaretoken', getCRSFToken())
        const res = await fetch(this.urls.create_attribute, {
            method: 'POST',
            body: form,
            credentials: 'same-origin',
        })
        if (res.status == 200) {
            this.setState({
                loading: false,
                addAttributeDialog:{
                    ...this.state.addAttributeDialog,
                    success: true,
                    fail: false,
                }
            },
            this.getLayerAttributes
            )
        }
        if (res.status == 500){
            this.setState({
                loading: false,
                addAttributeDialog:{
                    ...this.state.addAttributeDialog,
                    success: false,
                    fail: true,
                }
            })
        }
    }
    resultsDialogClose() {
        this.setState({
            resultsDialog: {
                ...this.state.resultsDialog,
                open: false
            }
        })
    }
    resultsDialogOpen() {
        this.setState({
            resultsDialog: {
                ...this.state.resultsDialog,
                open: true
            }
        })
    }
    outLayersDialogClose() {
        this.setState({
            outLayersDialog: {
                ...this.state.outLayersDialog,
                open: false
            }
        })
    }
    fetchResources() {
        const params = {
            'limit': '20',
            'title__contains': this.state.resourceSelectDialog.searchValue,
        }
        const url = UrlAssembler(this.urls.layersAPI).query(params).toString()
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCRSFToken(),
            }
        }).then((response) => {
            return response.json()
        })
            .then(data => {
                this.setState({
                    loading: false,
                    resourceSelectDialog: {
                        ...this.state.resourceSelectDialog,
                        resources: data.objects
                    }
                })
            })
    }
    componentDidMount() {
        this.setState(
            {
                loading: true
            },
            () => {
                this.fetchResources()
            }
        )
    }
    onResourceSelect(resource) {
        this.checkedLineFeatures = []
        this.setState({
            resourceSelectInput: {
                ...this.state.resourceSelectInput,
                selectedResource: resource
            },
            resourceSelectDialog: {
                ...this.state.resourceSelectDialog,
                open: false
            },
            loading: true
        },
            this.getLayerAttributes
        )
    }
    async getLayerAttributes() {
        const layer = this.state.resourceSelectInput.selectedResource
        const params = {
            'layer_name': layer.name
        }
        const url = UrlAssembler(this.urls.get_attributes).query(params).toString()
        const res = await  fetch(url, {
            method: 'GET',
            credentials: 'include',
        })
        const data = await res.json() 
        this.setState({
            attributeManager: {
                ...this.state.attributeManager,
                attributes: data.objects,
            },
            loading: false
        })
    }
    publishChange(e) {
        if (e.target.name === "groupByValue" && e.target.value !== this.state.publishForm["groupByValue"]) {
            this.checkedLineFeatures = []
        }
        this.setState({
            publishForm: {
                ...this.state.publishForm,
                [e.target.name]: e.target.value,
            }
        })
    }
    validateFormData(form) {
        let emptyOrUndefined = (str) => {
            return str && str.length > 0
        }
        let validateTableName = (tableName) => {
            let re = /^[a-z0-9_]{1,63}$/
            return tableName && re.test(tableName)
        }
        let formErrors = undefined
        if (!emptyOrUndefined(form.inLayerName)) {
            formErrors = {
                ...formErrors,
                inLayerName: true
            }
        }
        if (!validateTableName(form.outLayerName)) {
            formErrors = {
                ...formErrors,
                outLayerName: true
            }
        }
        return formErrors
    }
    apply() {
        const handleFailure = (res) => {
            res.json().then(jsonResponse => {
                this.setState({
                    loading: false,
                    resultsDialog: {
                        ...this.state.resultsDialog,
                        open: true,
                        errors: jsonResponse.message,
                        success: undefined,
                    }
                })
            })
        }
        const handleSuccess = (res) => {
            res.json().then(jsonResponse => {
                this.setState({
                    loading: false,
                    resultsDialog: {
                        ...this.state.resultsDialog,
                        open: true,
                        errors: undefined,
                        success: jsonResponse.message,
                        layerURL: this.urls.layerDetail(jsonResponse.layer_name),
                    }
                })
            })
        }
        const lineLayersSuccess = (res) => {
            res.json().then(jsonResponse => {
                this.setState({
                    loading: false,
                    outLayersDialog: {
                        ...this.state.outLayersDialog,
                        open: true,
                        errors: undefined,
                        success: jsonResponse.message,
                        outLayers: jsonResponse.objects
                    }
                })
            })
        }
        const lineLayersFailure = (res) => {
            res.json().then(jsonResponse => {
                this.setState({
                    loading: false,
                    outLayersDialog: {
                        ...this.state.outLayersDialog,
                        open: true,
                        errors: jsonResponse.message,
                        success: undefined,
                    }
                })
            })
        }
        const submit = ({
            inLayerName,
            outLayerName,
            sortByValue,
            groupByValue,
            checkedLineFeatures
        }) => {
            let form = new FormData();
            form.append('in_layer_name', inLayerName)
            if (sortByValue && sortByValue.length > 0)
                form.append('sort_by_attr', sortByValue)
            if (groupByValue && groupByValue.length > 0)
                form.append('group_by_attr', groupByValue)
            if (checkedLineFeatures && checkedLineFeatures.length > 0)
                form.append('line_features', JSON.stringify(checkedLineFeatures))
            form.append('out_layer_name', outLayerName)
            form.append('csrfmiddlewaretoken', getCRSFToken())
            fetch(this.urls.generateLineLayer, {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
            })
                .then(res => {
                    if (res.status == 500) {
                        handleFailure(res)
                    }
                    if (res.status == 200) {
                        handleSuccess(res)
                    }
                })
        }
        const getLineFeatures = ({
            inLayerName,
            outLayerName,
            sortByValue,
            groupByValue
        }) => {
            let form = new FormData();
            form.append('in_layer_name', inLayerName)
            if (sortByValue && sortByValue.length > 0)
                form.append('sort_by_attr', sortByValue)
            if (groupByValue && groupByValue.length > 0)
                form.append('group_by_attr', groupByValue)
            form.append('out_layer_name', outLayerName)
            form.append('csrfmiddlewaretoken', getCRSFToken())
            fetch(this.urls.getLineFeatures, {
                method: 'POST',
                body: form,
                credentials: 'same-origin',
            })
                .then(res => {
                    if (res.status == 500) {
                        lineLayersFailure(res)
                    }
                    if (res.status == 200) {
                        lineLayersSuccess(res)
                    }
                })
        }
        const {
            selectedResource,
            sortByValue,
            groupByValue,
            outLayerName,
        } = this.state.publishForm
        const checkedLineFeatures = this.checkedLineFeatures
        const inLayerName = selectedResource && selectedResource.name
        const errors = this.validateFormData({
            inLayerName,
            outLayerName,
            sortByValue,
            groupByValue
        })
        if (errors) {
            this.setState({
                publishForm: {
                    ...this.state.publishForm,
                    errors,
                }
            })
        } else {
            if (groupByValue.length == 0) {
                // get single line feature from all points in the selected point layer
                // submit without checkedLineFeatures
                this.setState({
                    publishForm: {
                        ...this.state.publishForm,
                        errors: {},
                    },
                    loading: true
                },
                    () => {
                        submit({
                            inLayerName,
                            outLayerName,
                            sortByValue,
                            groupByValue
                        })
                    }
                )
            }

            if (groupByValue.length > 0 && checkedLineFeatures.length == 0) {
                this.setState({
                    publishForm: {
                        ...this.state.publishForm,
                        errors: {},
                    },
                    loading: true
                },
                    () => {
                        getLineFeatures({
                            inLayerName,
                            outLayerName,
                            sortByValue,
                            groupByValue
                        })
                    }
                )
            }
            if (groupByValue.length > 0 && checkedLineFeatures.length > 0) {
                // submit with list of selected line features
                this.setState({
                    publishForm: {
                        ...this.state.publishForm,
                        errors: {},
                    },
                    loading: true
                },
                    () => {
                        submit({
                            inLayerName,
                            outLayerName,
                            sortByValue,
                            groupByValue,
                            checkedLineFeatures
                        })
                    }
                )
            }
        }
    }
    onOutLayerCheck(e) {
        let lineNames = [...this.checkedLineFeatures]
        if (e.target.checked) {
            lineNames = [...lineNames, e.target.value]
        } else {
            lineNames.splice(lineNames.indexOf(e.target.value), 1)
        }
        this.checkedLineFeatures = [...lineNames]
    }
    onSearchChange(e){
        this.setState({
            resourceSelectDialog: {
                ...this.state.resourceSelectDialog,
                searchValue: e.target.value,
            }
        },
        this.fetchResources
        )
    }
    async onAttrDelete(){
        this.setState({loading: true})
        const attributeName = this.state.deleteAttributeDialog.attributeName
        const layerName = this.state.resourceSelectInput.selectedResource.name
        const url = this.urls.delete_attribute
        let form = new FormData();
        form.append('layer_name', layerName)
        form.append('attribute_name', attributeName)
        form.append('csrfmiddlewaretoken', getCRSFToken())
        const res = await fetch(url, {
            method: 'POST',
            body: form,
            credentials: 'same-origin',
        })
        if (res.status == 200) {
            this.setState({
                loading: false,
                deleteAttributeDialog:{
                    ...this.state.deleteAttributeDialog,
                    success: true,
                    fail: false,
                }
            },
            this.getLayerAttributes
            )
        }
        if (res.status == 500){
            this.setState({
                loading: false,
                deleteAttributeDialog:{
                    ...this.state.deleteAttributeDialog,
                    success: false,
                    fail: true,
                }
            })
        }
    }
    render() {
        const props = {
            urls: this.urls,
            resourceSelectDialog: {
                ...this.state.resourceSelectDialog,
                handleClose: this.resourceSelectDialogClose,
                onResourceSelect: this.onResourceSelect,
                selectedResource: this.state.publishForm.selectedResource,
                loading: this.state.loading,
                onSearchChange: this.onSearchChange,
            },
            resourceSelectInput: {
                ...this.state.resourceSelectInput,
                resourceSelectDialogOpen: this.resourceSelectDialogOpen,
                loading: this.state.loading
            },
            attributeManager:{
                ...this.state.attributeManager,
                selectedResource: this.state.resourceSelectInput.selectedResource,
                onAddAttr: this.addAttributeDialogOpen,
                onDeleteAttr: this.deleteAttributeDialogOpen,
            },
            deleteAttributeDialog: {
                ...this.state.deleteAttributeDialog,
                loading: this.state.loading,
                attributes: this.state.attributeManager.attributes,              
                handleClose: this.deleteAttributeDialogClose,  
                onDelete: this.onAttrDelete,
                onChange: this.onDeleteAttrChange,
            },
            resultsDialog: {
                ...this.state.resultsDialog,
                handleClose: this.resultsDialogClose,
            },
            addAttributeDialog: {
                ...this.state.addAttributeDialog,
                loading: this.state.loading,
                handleClose: this.addAttributeDialogClose,
                onChange: this.onAddAttrChange,
                onAdd: this.onAddAttribute,
            },
            outLayersDialog: {
                ...this.state.outLayersDialog,
                inLayer: this.state.publishForm.selectedResource,
                groupByValue: this.state.publishForm.groupByValue,
                handleClose: this.outLayersDialogClose,
                onCheck: this.onOutLayerCheck
            }
        }
        return (
            <MainPage {...props} />
        )
    }
}