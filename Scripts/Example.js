(function($) {
    $(function() {
        $('body').dockingViewPort({
            north: {
                index: 1,
                el: '#north',
                size: 75,
                maxSize: 200,
                minSize: 40,
                resizable: true
            },
            south: {
                index: 2,
                el: '#south',
                size: 75,
                maxSize: 200,
                minSize: 40,
                resizable: true
            },
            west: {
                index: 3,
                el: '#west',
                resizable: true,
                size: 300,
                maxSize: 800
            },
            east: {
                index: 4,
                el: '#east',
                resizable: true,
                size: 300,
                maxSize: 800
            },
            center: {
                el: '#center'
            }
        });

        var solutionTree = [
            {
                label: 'Folder1',
                children: [
                    { label: 'File1' },
                    { label: 'File2' },
                    { label: 'File3' }
                ]
            },
            {
                label: 'Folder2',
                children: [
                    { label: 'File1' },
                    { label: 'File2' }
                ]
            },
            { label: 'File1' }
        ];

        var classTree = [
            {
                label: 'Class1',
                children: [
                    { label: 'Field1' },
                    { label: 'Field2' },
                    { label: 'Field3' }
                ]
            },
            {
                label: 'Class2',
                children: [
                    { label: 'Field1' },
                    { label: 'Field2' }
                ]
            }
        ];

        $('#solutionTree')
            .addClass('ui-not-selectable')
            .tree({ data: solutionTree, autoOpen: true });
        
        $('#classTree')
            .addClass('ui-not-selectable')
            .tree({ data: classTree, autoOpen: true });
    });
})(jQuery);