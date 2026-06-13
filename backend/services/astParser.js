import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

const resolveImportPath = (baseDir, importString) => {
    const rawPath = path.resolve(baseDir, importString);
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    
    if (fs.existsSync(rawPath) && fs.statSync(rawPath).isFile()) return rawPath;
    
    for (const ext of extensions) {
        if (fs.existsSync(rawPath + ext)) return rawPath + ext;
    }
    
    if (fs.existsSync(rawPath) && fs.statSync(rawPath).isDirectory()) {
        for (const ext of extensions) {
            if (fs.existsSync(path.join(rawPath, 'index' + ext))) {
                return path.join(rawPath, 'index' + ext);
            }
        }
    }
    return null;
};

const walkAST = (node, callback) => {
    if (!node || typeof node !== 'object') return;
    
    if (Array.isArray(node)) {
        node.forEach(child => walkAST(child, callback));
    } else {
        if (node.type) callback(node);
        
        for (const key in node) {
            if (key !== 'loc' && key !== 'range' && key !== 'comments' && key !== 'tokens') {
                walkAST(node[key], callback);
            }
        }
    }
};

export const parseFiles = (filePaths, rootDirectory) => {
    const results = [];

    filePaths.forEach(filePath => {
        const code = fs.readFileSync(filePath, 'utf-8');
        const stat = fs.statSync(filePath);
        const relativeFilePath = path.relative(rootDirectory, filePath).replace(/\\/g, '/');

        const fileNode = {
            id: relativeFilePath,
            size: stat.size,
            imports: [],
            jsxDependencies: [] 
        };

        try {
            const ast = parse(code, {
                sourceType: 'module',
                plugins: [
                    'jsx', 
                    'typescript', 
                    'decorators-legacy', 
                    'classProperties'
                ]
            });

            walkAST(ast, (node) => {
                
                if (node.type === 'ImportDeclaration') {
                    const importString = node.source.value;
                    
                    if (importString.startsWith('.')) {
                        const resolvedAbsolutePath = resolveImportPath(path.dirname(filePath), importString);
                        
                        if (resolvedAbsolutePath) {
                            const relativeImportId = path.relative(rootDirectory, resolvedAbsolutePath).replace(/\\/g, '/');
                            
                            if (!fileNode.imports.includes(relativeImportId)) {
                                fileNode.imports.push(relativeImportId);
                            }
                        }
                    }
                }

                if (node.type === 'JSXOpeningElement') {
                    let componentName = null;

                    if (node.name.type === 'JSXIdentifier') {
                        componentName = node.name.name;
                    } else if (node.name.type === 'JSXMemberExpression') {
                        componentName = node.name.property.name;
                    }

                    if (componentName && /^[A-Z]/.test(componentName)) {
                        const passedProps = [];
                        
                        node.attributes.forEach(attr => {
                            if (attr.type === 'JSXAttribute' && attr.name && attr.name.type === 'JSXIdentifier') {
                                passedProps.push(attr.name.name);
                            }
                        });

                        fileNode.jsxDependencies.push({
                            component: componentName,
                            props: passedProps
                        });
                    }
                }
            });
            
        } catch (e) {
            console.warn(`[Parser Warning] Parsing failed for: ${relativeFilePath}`);
        }

        results.push(fileNode);
    });

    return results;
};