function getModelName(model) {
    return model?.name ?? model?.options?.name?.singular;
}

export function defineRelation({
                                   source,
                                   target,
                                   type,
                                   foreignKey,
                                   through = null,
                                   options = {},
                                   inverse = true, // <== new option
                               }) {
    if (!source || !target || !type) {
        throw new Error("source, target, and type are required.");
    }

    const srcName = getModelName(source);
    const tgtName = getModelName(target);

    switch (type) {
        case 'hasMany':
            source.hasMany(target, { foreignKey, ...options });
            if (inverse) {
                target.belongsTo(source, { foreignKey, ...options });
                console.log(`[relaxql] Auto-defined: ${tgtName}.belongsTo(${srcName})`);
            }
            break;

        case 'hasOne':
            source.hasOne(target, { foreignKey, ...options });
            if (inverse) {
                target.belongsTo(source, { foreignKey, ...options });
                console.log(`[relaxql] Auto-defined: ${tgtName}.belongsTo(${srcName})`);
            }
            break;

        case 'belongsTo':
            source.belongsTo(target, { foreignKey, ...options });
            if (inverse) {
                target.hasMany(source, { foreignKey, ...options }); // not always correct, but a smart default
                console.log(`[relaxql] Auto-defined: ${tgtName}.hasMany(${srcName})`);
            }
            break;

        case 'belongsToMany':
            if (!through) throw new Error("Through model is required for belongsToMany");
            source.belongsToMany(target, { through, foreignKey, ...options });
            if (inverse) {
                target.belongsToMany(source, { through, ...options });
                console.log(`[relaxql] Auto-defined: ${tgtName}.belongsToMany(${srcName})`);
            }
            break;

        default:
            throw new Error(`Unknown relation type: ${type}`);
    }
}
