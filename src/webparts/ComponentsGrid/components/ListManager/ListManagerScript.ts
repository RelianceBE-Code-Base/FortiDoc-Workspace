import { sp, Web } from '@pnp/sp';
import { SPHttpClient } from '@microsoft/sp-http';

// Define the image files directly in the code
const imageFiles = [
    { name: '1.png', path: require('./assets/1.png') },
    { name: '2.png', path: require('./assets/2.png') },
    { name: '3.png', path: require('./assets/3.png') }
];

const lists = [
    {
        title: 'PinnedComponents',
        columns: [
            { title: 'UserEmail', type: 'Text' },
            { title: 'Pinned', type: 'Boolean' },
            { title: 'Order0', type: 'Number' },
            { title: 'IsRemoved', type: 'Boolean' }
        ],
        testData: [
            { Title: 'TestComponent1', UserEmail: 'testuser1@example.com', Pinned: false, Order0: 1, IsRemoved: false },
            { Title: 'TestComponent2', UserEmail: 'testuser2@example.com', Pinned: true, Order0: 2, IsRemoved: true }
        ]
    },
    {
        title: 'StaffDetailsInfo',
        columns: [
            { title: 'FirstName', type: 'Text' },
            { title: 'LastName', type: 'Text' },
            { title: 'Gender', type: 'Choice', choices: ['Male', 'Female', 'Other'] },
            { title: 'Department', type: 'Choice', choices: ['IT', 'HR', 'Finance', 'Marketing'] },
            { title: 'Designation', type: 'Choice', choices: ['Software Engineer', 'Manager', 'Director', 'CEO'] },
            { title: 'ResumptionDate', type: 'DateTime' },
            { title: 'DateOfBirth', type: 'DateTime' },
            { title: 'Location', type: 'Text' },
            { title: 'EmployeeName', type: 'User' }
        ],
        testData: [
            {
                Title: 'John Doe',
                FirstName: 'John',
                LastName: 'Doe',
                Gender: 'Male',
                Department: 'IT',
                Designation: 'Software Engineer',
                ResumptionDate: '2020-01-01T00:00:00Z',
                DateOfBirth: '1990-01-01T00:00:00Z',
                Location: 'New York',
                EmployeeNameId: null // This will be replaced with the current user's ID
            }
        ]
    },
    {
        title: 'LOB Apps',
        columns: [
            { title: 'ApplicationLink', type: 'Text' },
        ],
        testData: [
            { Title: 'Leave', ApplicationLink: 'https://reliance.systems/process-automation/' },
        ]
    },
    {
        title: 'Gallery Slide',
        isDocumentLibrary: true,
        columns: [
            { title: 'ImgDescription', type: 'Note' },
            { title: 'ResourceLink', type: 'Text' }
        ],
        testData: [
            { Title: '1', ImgDescription: 'First image', ResourceLink: 'https://reliance.systems/process-automation' },
            { Title: '2', ImgDescription: 'Second image', ResourceLink: 'https://reliance.systems/process-automation' },
            { Title: '3', ImgDescription: 'Third image', ResourceLink: 'https://reliance.systems/process-automation' }
        ]
    }
];

const checkAndCreateLists = async (tenantUrl: string, spHttpClient: SPHttpClient) => {
    const web = new Web(tenantUrl);
    sp.setup({
        sp: {
            baseUrl: tenantUrl
        }
    });

    for (const listInfo of lists) {
        const listExists = await checkListExists(web, listInfo.title);
        if (!listExists) {
            console.log(`Creating list: ${listInfo.title}`);
            await createList(web, listInfo, spHttpClient);
        } else {
            console.log(`List already exists: ${listInfo.title}`);
            const list = web.lists.getByTitle(listInfo.title);
            const listData = await list.get();
            const listId = listData.Id;
            await checkAndCreateColumns(web, listInfo, listId, spHttpClient);
        }
    }
};

const checkListExists = async (web: Web, listTitle: string): Promise<boolean> => {
    try {
        await web.lists.getByTitle(listTitle).get();
        return true;
    } catch (error) {
        console.log(`Error checking list existence: ${listTitle}`, error);
        return false;
    }
};

const createList = async (web: Web, listInfo: any, spHttpClient: SPHttpClient) => {
    try {
        let listAddResult;
        if (listInfo.isDocumentLibrary) {
            listAddResult = await web.lists.add(listInfo.title, '', 101); // 101 is the template type for document libraries
        } else {
            listAddResult = await web.lists.add(listInfo.title, '', 100);
        }
        const listId: string = listAddResult.data.Id;
        await createColumns(web, listInfo, listId);
        await addTestData(web, listInfo, listId, spHttpClient);
    } catch (error) {
        console.error(`Error creating list ${listInfo.title}:`, error);
    }
};

const createColumns = async (web: Web, listInfo: any, listId: string) => {
    try {
        const list = web.lists.getById(listId);
        const defaultView = await list.defaultView.get();

        for (const column of listInfo.columns) {
            try {
                await list.fields.getByInternalNameOrTitle(column.title).get();
                console.log(`Column already exists: ${column.title}`);
            } catch (error) {
                console.log(`Creating column: ${column.title}`);
                let fieldResult;
                switch (column.type) {
                    case 'Choice':
                        fieldResult = await list.fields.addChoice(column.title, column.choices);
                        break;
                    case 'DateTime':
                        fieldResult = await list.fields.addDateTime(column.title);
                        break;
                    case 'User':
                        fieldResult = await list.fields.addUser(column.title, 1);
                        break;
                    case 'Number':
                        fieldResult = await list.fields.addNumber(column.title);
                        break;
                    case 'Boolean':
                        fieldResult = await list.fields.addBoolean(column.title);
                        break;
                    case 'Note':
                        fieldResult = await list.fields.addMultilineText(column.title);
                        break;
                    case 'Text':
                    default:
                        fieldResult = await list.fields.addText(column.title);
                        break;
                }
                if (fieldResult && fieldResult.data) {
                    await defaultView.fields.add(fieldResult.data.InternalName);
                    console.log(`Added column to default view: ${column.title}`);
                } else {
                    console.error(`Failed to create column: ${column.title}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error creating columns for list ${listInfo.title}:`, error);
    }
};

const checkAndCreateColumns = async (web: Web, listInfo: any, listId: string, spHttpClient: SPHttpClient) => {
    try {
        const list = web.lists.getById(listId);
        const fields = await list.fields.get();
        const existingFields = fields.map((field: any) => field.Title);

        console.log(`Existing columns in list ${listInfo.title}:`, existingFields);

        const newColumns = listInfo.columns.filter((column: any) => !existingFields.includes(column.title));
        if (newColumns.length > 0) {
            console.log(`Creating new columns in list ${listInfo.title}:`, newColumns.map((col: any) => col.title));
            await createColumns(web, { ...listInfo, columns: newColumns }, listId);
        } else {
            console.log(`No new columns to create in list ${listInfo.title}`);
        }

        await addTestData(web, listInfo, listId, spHttpClient);
    } catch (error) {
        console.error(`Error checking/creating columns for list ${listInfo.title}:`, error);
    }
};

const addTestData = async (web: Web, listInfo: any, listId: string, spHttpClient: SPHttpClient) => {
    try {
        const currentUser = await sp.web.currentUser.get();
        const list = web.lists.getById(listId);

        const existingItems = await list.items.get();
        console.log(`Existing items in list ${listInfo.title}:`, existingItems);

        if (listInfo.isDocumentLibrary) {
            const folder = web.getFolderByServerRelativeUrl(`/sites/IntranetPortal2/${listInfo.title}`);
            for (const imageFile of imageFiles) {
                const uploadResult = await folder.files.addUsingPath(imageFile.name, imageFile.path, { Overwrite: true });
                console.log(`Uploaded file ${imageFile.name} to document library ${listInfo.title}`);

                // Add a brief delay before trying to get the list item
                await new Promise(resolve => setTimeout(resolve, 1000));

                const fileItem = await uploadResult.file.getItem();
                const metadata = listInfo.testData.find((item: any) => item.Title === imageFile.name.split('.')[0]);
                if (metadata) {
                    await fileItem.update(metadata);
                    console.log(`Updated metadata for file ${imageFile.name} in document library ${listInfo.title}`);
                }
            }
        } else {
            if (existingItems.length === 0) {
                for (const data of listInfo.testData) {
                    if (data.EmployeeNameId === null) {
                        data.EmployeeNameId = currentUser.Id;
                    }
                    const addedItem = await list.items.add(data);
                    console.log(`Added test data to list ${listInfo.title}:`, addedItem);
                }
            }
        }
    } catch (error) {
        console.error(`Error adding test data to list ${listInfo.title}:`, error);
    }
};

// const addTestData = async (web: Web, listInfo: any, listId: string, spHttpClient: SPHttpClient) => {
//     try {
//         const currentUser = await sp.web.currentUser.get();
//         const list = web.lists.getById(listId);

//         const existingItems = await list.items.get();
//         console.log(`Existing items in list ${listInfo.title}:`, existingItems);

//         if (existingItems.length === 0) {
//             for (const data of listInfo.testData) {
//                 if (data.EmployeeNameId === null) {
//                     data.EmployeeNameId = currentUser.Id;
//                 }
//                 const addedItem = await list.items.add(data);
//                 console.log(`Added test data to list ${listInfo.title}:`, addedItem);
//             }
//         }

//         if (listInfo.isDocumentLibrary) {
//             const folder = web.getFolderByServerRelativeUrl(`/sites/IntranetPortal2/${listInfo.title}`);
//             for (const imageFile of imageFiles) {
//                 const uploadResult = await folder.files.addUsingPath(imageFile.name, imageFile.path, { Overwrite: true });
//                 console.log(`Uploaded file ${imageFile.name} to document library ${listInfo.title}`);

//                 // Add a brief delay before trying to get the list item
//                 await new Promise(resolve => setTimeout(resolve, 1000));

//                 const fileItem = await uploadResult.file.getItem();
//                 const metadata = listInfo.testData.find((item: any) => item.Title === imageFile.name.split('.')[0]);
//                 if (metadata) {
//                     await fileItem.update(metadata);
//                     console.log(`Updated metadata for file ${imageFile.name} in document library ${listInfo.title}`);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error adding test data to list ${listInfo.title}:`, error);
//     }
// };

export default checkAndCreateLists;
