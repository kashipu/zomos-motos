import type { Schema, Struct } from '@strapi/strapi';

export interface CompartidoMetadatosSeo extends Struct.ComponentSchema {
  collectionName: 'components_compartido_metadatos_seos';
  info: {
    description: 'SEO Metadata global';
    displayName: 'Metadatos SEO';
    icon: 'search';
  };
  attributes: {
    descripcion_meta: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    imagen_meta: Schema.Attribute.Media<'images'>;
    titulo_meta: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    url_canonica_personalizada: Schema.Attribute.String;
  };
}

export interface TiendaCompatibilidadMoto extends Struct.ComponentSchema {
  collectionName: 'components_tienda_compatibilidades_moto';
  info: {
    description: 'Marca y modelo de moto compatible con el producto';
    displayName: 'Compatibilidad Moto';
    icon: 'motorcycle';
  };
  attributes: {
    marca_moto: Schema.Attribute.Relation<
      'oneToOne',
      'api::marca-moto.marca-moto'
    > &
      Schema.Attribute.Required;
    modelo_moto: Schema.Attribute.Relation<
      'oneToOne',
      'api::modelo-moto.modelo-moto'
    > &
      Schema.Attribute.Required;
  };
}

export interface TiendaVariantePiloto extends Struct.ComponentSchema {
  collectionName: 'components_tienda_variantes_piloto';
  info: {
    description: 'Talla, color y stock por variante';
    displayName: 'Variante de Piloto';
    icon: 'user-check';
  };
  attributes: {
    cantidad_stock: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    color: Schema.Attribute.String & Schema.Attribute.Required;
    talla: Schema.Attribute.Enumeration<
      ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICA']
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'compartido.metadatos-seo': CompartidoMetadatosSeo;
      'tienda.compatibilidad-moto': TiendaCompatibilidadMoto;
      'tienda.variante-piloto': TiendaVariantePiloto;
    }
  }
}
