# Desktop app para agregar filtros a imagenes

## Recomendaciones

- Para empaquetar se sugiere `electron-forge`.

- Para construir el instalador se sugiere hacer el `build` en el OS nativo.

- Para optar por una certificación para la aplicación, se tiene:
    - Windows: Symantec
    - Mac: Apple Developers

- Para manejar el tema del CI y un versionado de entregables para el instalador:
    - Windows: AppVeyor
    - Mac/Linux: Travis CI

## Retos / Mejoras

- Adicionar filtros personalizados, basados en controladores de brillo, saturación, etc.

- Listar las imágenes en la ubicación remota de CloudUp

- Previsualizar varios filtros en paralelo
