// Inscrire les plugins utilisés
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

// Configuration des options (ici style ratio)
FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});

// Convertir tous les input file en tant qu'objets filepond
FilePond.parse(document.body);
