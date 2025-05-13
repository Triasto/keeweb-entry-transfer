const Plugin = {
  id: 'keeweb-entry-transfer',
  name: 'KeeWeb Entry Transfer',
  description: 'Compares entries between open databases and copies missing ones with a prefix',
  version: '1.1.0',
  author: 'Your Name',
  init() {
    const AppModel = require('models/app-model');

    AppModel.instance.menu.add({
      icon: 'arrow-right-circle',
      title: 'Compare and Copy Entries with Prefix',
      click: async () => {
        const files = AppModel.instance.files;

        if (files.length < 2) {
          alert('You need at least two databases open.');
          return;
        }

        const sourceFileName = prompt('Source database name:');
        const targetFileName = prompt('Target database name:');
        const prefix = prompt('Prefix to add to new entry titles (optional):') || '';

        const sourceDb = files.find(file => file.name === sourceFileName);
        const targetDb = files.find(file => file.name === targetFileName);

        if (!sourceDb || !targetDb) {
          alert('One or both databases were not found.');
          return;
        }

        let copied = 0;
        const targetEntries = targetDb.entries;
        const sourceEntries = sourceDb.entries;

        sourceEntries.forEach(sourceEntry => {
          const exists = targetEntries.some(targetEntry => {
            return targetEntry.title === sourceEntry.title &&
                   targetEntry.user === sourceEntry.user &&
                   targetEntry.password.getText() === sourceEntry.password.getText();
          });

          if (!exists) {
            const clonedEntry = sourceEntry.clone();
            clonedEntry.title = `${prefix}${clonedEntry.title}`;
            targetDb.addEntry(clonedEntry);
            copied++;
          }
        });

        alert(`${copied} new entries copied from ${sourceFileName} to ${targetFileName} with prefix "${prefix}".`);
      }
    });
  }
};

module.exports = Plugin;
