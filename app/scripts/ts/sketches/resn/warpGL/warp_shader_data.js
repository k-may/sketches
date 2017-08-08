/**
 * Created by kev on 16-03-01.
 */


define(['underscore',
        'rsvp',
        'util/utils',
        'common/shader_data',
        'sketches/warpGL/frame_geometry'],

    function (_,
        RSVP,
        Utils,
        ShaderData,
        FrameGeometry) {

        var WrapShaderData = (function () {

            function WarpShaderData(fragmentId,vertexId) {
                this.fragmentId = fragmentId;
                this.vertexId = (vertexId === "" || vertexId === undefined) ? "vertex" : vertexId;

                this.uniforms = {
                    time      :{
                        value:1.0,
                        type :'f'
                    },
                    resolution:{
                        value:new THREE.Vector2(),
                        type :"v2"
                    },
                    mouse     :{
                        value:new THREE.Vector2(),
                        type :"v2"
                    },
                    depth     :{
                        value:0.0,
                        type :'f'
                    }
                };
            }

            WarpShaderData.prototype = {

                group:null,

                meshes    :[],
                uniforms  :null,
                scene     :null,
                camera    :null,
                fragmentId:"",
                vertexId  :"",

                fragmentShader:"",
                vertexShader  :"",
                ready         :false,

                width :-1,
                height:-1,
                time  :0,

                start:function (num) {
                    var _this = this;
                    return new RSVP.Promise(function (resolve,reject) {
                        Utils.LoadShaders([_this.fragmentId,_this.vertexId]).then(function (arr) {
                            _this.fragmentShader = arr[0];
                            _this.vertexShader = arr[1];
                            _this.createMaterial(num);
                            resolve();
                        });
                    });
                },

                createMaterial:function (num) {

                    var loader = new THREE.TextureLoader();
                    this.texture = loader.load("img/AYCF_heroin.jpg");//"img/AYCF_MDMA.jpg");
                    this.uniforms.texture = {
                        type :"t",
                        value:this.texture
                    };

               

                    this.camera = new THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,1,1000);
                  //  this.camera.position.set(0,150,500);
     this.camera.position.set(0,150,1000);
                    this.scene = new THREE.Scene();
                    this.scene.add(this.camera);

                    //this.camera.lookAt(this.scene.position);

                    /**/

                    // this.group = new THREE.Group();

                    for (var i = 0; i < num; i++) {
                        var mesh = this.createMesh(num);
                        this.scene.add(mesh);

                    }
                    //  this.scene.add(this.group);

                    this.ready = true;
                },

                createMesh:function (num) {
                    this.material = new THREE.ShaderMaterial({
                        uniforms      :{
                            time      :{
                                value:1.0,
                                type :'f'
                            },
                            total     :{
                                value:num,
                                type :'f'
                            },
                            resolution:{
                                value:new THREE.Vector2(),
                                type :"v2"
                            },
                            mouse     :{
                                value:new THREE.Vector2(),
                                type :"v2"
                            },
                            depth     :{
                                value:0.0,
                                type :'f'
                            },texture :{
                                type :"t",
                                value:this.texture
                            }
                        },
                        vertexShader  :this.vertexShader,
                        fragmentShader:this.fragmentShader,
                        side          :THREE.DoubleSide,
                        blending      :THREE.NormalBlending,
                        transparent   :true,
                    });

                    this.material.neesUpdate = true;

                    var frameGeometry = new FrameGeometry();
                    var mesh = new THREE.Mesh(frameGeometry,this.material);

                    return mesh;
                },

                update:function (w,h,mx,my) {
                    
                         
                    this.uniforms.time.value = this.time += 0.05;
                    this.uniforms.resolution.value.x = w;
                    this.uniforms.resolution.value.y = h;
                    if (mx && my) {
                        this.uniforms.mouse.value.x = mx / w;
                        this.uniforms.mouse.value.y = my / h;
                    }

                    //this.updateMesh(this.scene.children[0]);
                },

                updateFrame:function (index,outer,inner, zOffset) {
                    //this.uniforms.depth.value = index;
                    var child = this.scene.children[index + 1];
                    child.material.uniforms.depth.value = index+zOffset;
                    child.material.uniforms.resolution.value.x = this.uniforms.resolution.value.x;
                    child.material.uniforms.resolution.value.y = this.uniforms.resolution.value.y;
                    child.geometry.update(outer,inner,1.0);
                    // this.scene.children[index].geometry.verticesNeedUpdate = true;
                },

                render:function (renderer) {
                    this.scene.needsUpdate = true;
                    this.scene.children[0].needsUpdate = true;
                    renderer.render(this.scene,this.camera);
                }
            };


            return WarpShaderData;

        })();

        return WrapShaderData;

    });