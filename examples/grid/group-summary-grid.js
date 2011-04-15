Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.field.Number',
    'Ext.form.field.Date'
]);

Ext.define('Task', {
    extend: 'Ext.data.Model',
    idProperty: 'taskId',
    fields: [
        {name: 'projectId', type: 'int'},
        {name: 'project', type: 'string'},
        {name: 'taskId', type: 'int'},
        {name: 'description', type: 'string'},
        {name: 'estimate', type: 'float'},
        {name: 'rate', type: 'float'},
        {name: 'cost', type: 'float'},
        {name: 'due', type: 'date', dateFormat:'m/d/Y'}
    ]
});

var data = [
    {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 112, description: 'Integrate 2.0 Forms with 2.0 Layouts', estimate: 6, rate: 150, due:'06/24/2007'},
    {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 113, description: 'Implement AnchorLayout', estimate: 4, rate: 150, due:'06/25/2007'},
    {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 114, description: 'Add support for multiple types of anchors', estimate: 4, rate: 150, due:'06/27/2007'},
    {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 115, description: 'Testing and debugging', estimate: 8, rate: 0, due:'06/29/2007'},
    {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 101, description: 'Add required rendering "hooks" to GridView', estimate: 6, rate: 100, due:'07/01/2007'},
    {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 102, description: 'Extend GridView and override rendering functions', estimate: 6, rate: 100, due:'07/03/2007'},
    {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 103, description: 'Extend Store with grouping functionality', estimate: 4, rate: 100, due:'07/04/2007'},
    {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 121, description: 'Default CSS Styling', estimate: 2, rate: 100, due:'07/05/2007'},
    {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 104, description: 'Testing and debugging', estimate: 6, rate: 100, due:'07/06/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 105, description: 'Ext Grid plugin integration', estimate: 4, rate: 125, due:'07/01/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 106, description: 'Summary creation during rendering phase', estimate: 4, rate: 125, due:'07/02/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 107, description: 'Dynamic summary updates in editor grids', estimate: 6, rate: 125, due:'07/05/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 108, description: 'Remote summary integration', estimate: 4, rate: 125, due:'07/05/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 109, description: 'Summary renderers and calculators', estimate: 4, rate: 125, due:'07/06/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 110, description: 'Integrate summaries with GroupingView', estimate: 10, rate: 125, due:'07/11/2007'},
    {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 111, description: 'Testing and debugging', estimate: 8, rate: 125, due:'07/15/2007'}
];

Ext.onReady(function(){
    var store = Ext.create('Ext.data.Store', {
        model: 'Task',
        data: data,
        sorters: {property: 'due', direction: 'ASC'},
        groupField: 'project'
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        listeners: {
            afteredit: function(){
                // refresh summaries
                grid.getView().refresh();
            }
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        width: 800,
        height: 450,
        frame: true,
        title: 'Sponsored Projects',
        renderTo: document.body,
        store: store,
        plugins: [cellEditing],
        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                text: 'Show Summary',
                pressed: true,
                enableToggle: true,
                toggleHandler: function(btn, pressed){
                    var view = grid.getView();
                    view.getFeature('group').toggleSummaryRow(pressed);
                    view.refresh();
                }
            }]
        }],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true
        }],
        columns: [{
            text: 'Task',
            flex: 1,
            tdCls: 'task',
            sortable: true,
            dataIndex: 'description',
            hideable: false,
            summaryType: 'count',
            renderer: function(v, params) {
                params.tdCls = "task";
                return v;
            },
            summaryRenderer: function(v, params, data) {
                return ((v === 0 || v > 1) ? '(' + v + ' Tasks)' : '(1 Task)');
            }
        }, {
            header: 'Project',
            width: 20,
            sortable: true,
            dataIndex: 'project'
        }, {
            header: 'Due Date',
            width: 120,
            sortable: true,
            dataIndex: 'due',
            summaryType: 'max',
            renderer: Ext.util.Format.dateRenderer('m/d/Y'),
            field: {
                xtype: 'datefield'
            }
        }, {
            header: 'Estimate',
            width: 75,
            sortable: true,
            dataIndex: 'estimate',
            summaryType: 'sum',
            renderer: function(v){
                return v + ' hours';
            },
            field: {
                xtype: 'numberfield'
            }
        }, {
            header: 'Rate',
            width: 75,
            sortable: true,
            renderer: Ext.util.Format.usMoney,
            dataIndex: 'rate',
            summaryType: 'average',
            field: {
                xtype: 'numberfield'
            }
        }, {
            id: 'cost',
            header: 'Cost',
            width: 75,
            sortable: false,
            groupable: false,
            renderer: function(v, params, record){
                return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
            },
            dataIndex: 'cost',
            summaryType: function(records){
                var i = 0,
                    length = records.length,
                    total = 0,
                    record;

                for (; i < length; ++i) {
                    record = records[i];
                    total += record.get('estimate') * record.get('rate');
                }
                return total;
            },
            summaryRenderer: Ext.util.Format.usMoney
        }]
    });
});
