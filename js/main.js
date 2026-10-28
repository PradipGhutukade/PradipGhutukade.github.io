(function(){
  var categories=[
    {id:'motion-graphics-video',title:'Motion Graphics & Video',description:'Dynamic motion graphics and visual storytelling for standout brand content.',short:'Motion Graphics & Video',role:'Motion Graphics Artist'},
    {id:'3d-product-animation',title:'3D Product Animation',description:'Realistic product visuals and engaging animations that bring products to life.',short:'3D Product Animation',role:'3D Product Animator'},
    {id:'ai-video-generation-editing',title:'AI Video Generation & Editing',description:'Creative AI-powered visuals and professional video editing for modern content.',short:'AI Video & Editing',role:'AI Video Creator'},
    {id:'architectural-visualization',title:'Architectural Visualization',description:'Detailed 3D architectural visuals and building spaces brought to life.',short:'Architectural Visualization',role:'3D Visualizer'},
    {id:'product-design-visualization',title:'Product Design & Visualization',description:'Thoughtful product concepts and clear, compelling visual presentations.',short:'Product Design',role:'Product Visual Designer'}
  ];
  var nav=document.querySelector('.nav'),toggle=document.querySelector('.nav__toggle');
  if(toggle){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
    });
  }
  document.querySelectorAll('.nav__links a').forEach(function(link){
    link.addEventListener('click',function(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')});
  });
  document.getElementById('yr').textContent=new Date().getFullYear();

  var categoryModal=document.getElementById('category-modal');
  var categoryNav=categoryModal.querySelector('.category-modal__nav');
  var results=document.getElementById('category-projects');
  var title=document.getElementById('category-title');
  var description=document.getElementById('category-description');
  var count=document.getElementById('category-count');
  var selectedCategory=0,scanId=0,lastCategoryTrigger=null,lastProjectTrigger=null;

  categories.forEach(function(category,index){
    var button=document.createElement('button');
    button.type='button';
    button.innerHTML='<span class="category-modal__nav-icon" aria-hidden="true">'+String(index+1).padStart(2,'0')+'</span><span>'+category.short+'<small>Browse projects</small></span>';
    button.addEventListener('click',function(){showCategory(index)});
    categoryNav.appendChild(button);
  });

  function imageExists(src){
    return new Promise(function(resolve){
      var image=new Image();
      image.onload=function(){resolve(true)};
      image.onerror=function(){resolve(false)};
      image.src=src;
    });
  }

  function makeTile(project,category,index){
    var button=document.createElement('button');
    button.type='button';
    button.className='project-tile';
    if(category.id==='ai-video-generation-editing')button.classList.add('project-tile--landscape');
    button.setAttribute('aria-label','Play '+project.title);
    var image=document.createElement('img');
    image.src=project.cover;
    image.alt=project.title;
    image.loading='lazy';
    var number=document.createElement('span');
    number.className='project-tile__index';
    number.textContent=String(index+1).padStart(2,'0');
    var play=document.createElement('span');
    play.className='project-tile__play';
    play.setAttribute('aria-hidden','true');
    play.textContent='▶';
    var name=document.createElement('span');
    name.className='project-tile__name';
    name.textContent=project.title;
    var categoryName=document.createElement('span');
    categoryName.className='project-tile__category';
    categoryName.textContent=category.title;
    button.append(image,number,play,name,categoryName);
    button.addEventListener('click',function(){openProject(project,category,button)});
    return button;
  }

  function showCategory(index){
    selectedCategory=(index+categories.length)%categories.length;
    var category=categories[selectedCategory],requestId=++scanId;
    title.textContent=category.title;
    description.textContent=category.description;
    categoryNav.querySelectorAll('button').forEach(function(button,buttonIndex){
      if(buttonIndex===selectedCategory)button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
    count.textContent='Loading projects';
    results.replaceChildren();
    categoryModal.hidden=false;
    document.body.classList.add('modal-open');

    var checks=[];
    for(var slot=1;slot<=6;slot++){
      (function(number){
        var id=String(number).padStart(2,'0');
        var base='assets/projects/'+category.id+'/project-'+id+'/';
        checks.push(imageExists(base+'cover.jpg').then(function(exists){
          return exists?{id:id,title:'Project '+id,cover:base+'cover.jpg',video:base+'video.mp4'}:null;
        }));
      })(slot);
    }
    Promise.all(checks).then(function(projects){
      if(requestId!==scanId)return;
      var available=projects.filter(Boolean);
      count.textContent=String(available.length).padStart(2,'0')+' '+(available.length===1?'Project':'Projects');
      if(!available.length){
        var empty=document.createElement('div');
        empty.className='category-empty';
        var message=document.createElement('strong');
        message.textContent='Projects are on the way';
        var instruction=document.createElement('span');
        instruction.textContent='Add up to 6 project folders to this category to have them appear here.';
        var path=document.createElement('code');
        path.textContent='assets/projects/'+category.id+'/project-01/cover.jpg + video.mp4';
        empty.append(message,instruction,path);
        results.appendChild(empty);
        return;
      }
      available.forEach(function(project,projectIndex){
        results.appendChild(makeTile(project,category,projectIndex));
      });
    });
  }

  document.querySelectorAll('.service-card').forEach(function(card){
    card.addEventListener('click',function(){
      lastCategoryTrigger=card;
      var index=categories.findIndex(function(category){return category.id===card.dataset.category});
      if(index!==-1)showCategory(index);
    });
  });

  var modal=document.getElementById('modal'),video=modal.querySelector('video');
  var projectTitle=document.getElementById('modal-title');
  var projectDescription=document.getElementById('project-description');
  var projectCategory=document.getElementById('project-category');
  var projectDetailsTitle=document.getElementById('project-details-title');
  var projectDeliverables=document.getElementById('project-deliverables');
  var role=modal.querySelector('.modal__role');
  function showProjectViewer(){
    modal.classList.toggle('modal--landscape',video.videoWidth>video.videoHeight);
    modal.hidden=false;
    modal.querySelector('.modal__close').focus();
  }
  function openProject(project,category,trigger){
    lastProjectTrigger=trigger;
    modal.classList.remove('modal--landscape');
    var projectDetails=null;
    if(category.id==='motion-graphics-video'&&project.id==='01'){
      projectDetails={
        title:'Project 01 | Pixel Fineliner Pen',
        description:'Created a product-focused promotional video for the Pixel Fineliner Pen, combining video editing, motion graphics, and polished visuals to highlight the product’s design and creative appeal.',
        role:'My Role: Video Editor & Motion Graphics Artist',
        deliverables:['Video Editing','Motion Graphics','Product Promotion','Visual Storytelling']
      };
    }else if(category.id==='ai-video-generation-editing'&&project.id==='01'){
      projectDetails={
        title:'Your Business Has Its Own Ravana',
        description:'Created an AI-powered Dussehra promotional video for WMS, using mythological visuals to represent nine digital business challenges. Combined AI-generated scenes, visual storytelling, and video editing to deliver a festive brand message: “Defeat the Digital Obstacles This Dussehra with WMS.”',
        role:'My Role: AI Video Creator & Video Editor',
        deliverables:['AI Video Generation','AI Visual Storytelling','Video Editing & Sequencing','Brand Promotional Video','Festival Campaign Content']
      };
    }else if(category.id==='motion-graphics-video'&&project.id==='02'){
      projectDetails={
        title:'Project 02 | Hype Ball Pen',
        description:'Created a promotional product video for the You Got Hype Ball Pen, combining dynamic editing and motion graphics to highlight the pen’s design, features, and visual appeal.',
        role:'My Role: Video Editor & Motion Graphics Artist',
        deliverables:['Video Editing','Motion Graphics','Product Promotion','Visual Storytelling']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='01'){
      projectDetails={
        title:'Project 01 | Official ISRO Series Ball Pen',
        description:'Created a premium 3D product film for the officially licensed ISRO Series Ball Pen, combining realistic 3D visuals, detailed materials, refined lighting, and cinematic camera movements. Enhanced the final presentation through professional video editing and post-production to deliver a polished, engaging promotional film.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Modeling & Visualization','Realistic Materials & Lighting','Cinematic Camera Animation','3D Animation & Rendering','Video Editing & Sequencing','Color Grading & Post-Production','Final Promotional Video']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='02'){
      projectDetails={
        title:'Project 02 | Gravity Ball Pen',
        description:'Created a 3D product animation highlighting the Gravity Ball Pen’s design and details through realistic visuals and polished editing.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Animation','Video Editing','Final Promotional Video']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='03'){
      projectDetails={
        title:'Project 03 | XO Click Gel Pen',
        description:'Created a detailed 3D product animation showcasing the XO Click Gel Pen’s design and advanced tip mechanism, highlighting its fine details and mechanical functionality through realistic visuals and polished editing.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Animation','Mechanical Detail Visualization','Product Feature Showcase','Video Editing','Final Promotional Video']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='04'){
      projectDetails={
        title:'Project 04 | Domino Dust-Free Eraser',
        description:'Created a 3D product animation featuring Domino Dust-Free Erasers arranged in a domino-style sequence, combining colorful product graphics, engaging movement, and clean visuals to create a playful product showcase.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Animation','Product Visualization','Domino-Style Animation','Video Editing','Final Promotional Video']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='05'){
      projectDetails={
        title:'Project 05 | Pod Eraser',
        description:'Created a 3D product animation showcasing the Pod Eraser through detailed product visuals, smooth animation, and polished editing to present its design and appeal.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Animation','Product Visualization','Video Editing','Final Promotional Video']
      };
    }else if(category.id==='3d-product-animation'&&project.id==='06'){
      projectDetails={
        title:'Project 06 | Flair Inky Grip Liquid Ink Fountain Pen',
        description:'Created a premium 3D product animation for the Flair Inky Grip Liquid Ink Fountain Pen, showcasing its design and finish through realistic 3D visuals, detailed materials, refined lighting, and smooth camera movements. Enhanced the final presentation with professional video editing and post-production to create a polished product promotional film.',
        role:'My Role: 3D Product Animator & Video Editor',
        deliverables:['3D Product Visualization','Realistic Materials & Lighting','Camera Animation','3D Animation & Rendering','Video Editing & Sequencing','Color Grading & Post-Production','Final Promotional Video']
      };
    }
    if(projectDetails){
      projectTitle.textContent=projectDetails.title;
      projectDescription.textContent=projectDetails.description;
      projectDetailsTitle.textContent='Deliverables';
      projectCategory.hidden=true;
      projectDeliverables.replaceChildren();
      projectDetails.deliverables.forEach(function(deliverable){
        var item=document.createElement('li');
        item.textContent=deliverable;
        projectDeliverables.appendChild(item);
      });
      projectDeliverables.hidden=false;
      role.textContent=projectDetails.role;
    }else{
      projectTitle.textContent=project.title+' | '+category.title;
      projectDescription.textContent='A '+category.title.toLowerCase()+' project created to bring the idea to life through polished visuals and considered storytelling.';
      projectDetailsTitle.textContent='Project category';
      projectCategory.textContent=category.title;
      projectCategory.hidden=false;
      projectDeliverables.hidden=true;
      role.textContent='My role. '+category.role;
    }
    video.poster=project.cover;
    video.onloadedmetadata=showProjectViewer;
    video.onerror=showProjectViewer;
    video.src=project.video;
    document.body.classList.add('modal-open');
    video.play().catch(function(){});
  }
  function closeProject(){
    video.pause();
    video.onloadedmetadata=null;
    video.onerror=null;
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
    modal.classList.remove('modal--landscape');
    modal.hidden=true;
    if(lastProjectTrigger&&lastProjectTrigger.isConnected)lastProjectTrigger.focus();
    else categoryModal.querySelector('.category-modal__close').focus();
    syncScrollLock();
  }
  function closeCategories(){
    categoryModal.hidden=true;
    scanId++;
    if(lastCategoryTrigger&&lastCategoryTrigger.isConnected)lastCategoryTrigger.focus();
    syncScrollLock();
  }
  function syncScrollLock(){
    if(categoryModal.hidden&&modal.hidden)document.body.classList.remove('modal-open');
    else document.body.classList.add('modal-open');
  }
  categoryModal.querySelector('.category-modal__close').addEventListener('click',closeCategories);
  categoryModal.addEventListener('click',function(event){if(event.target===categoryModal)closeCategories()});
  categoryModal.querySelectorAll('.category-modal__step').forEach(function(button){
    button.addEventListener('click',function(){showCategory(selectedCategory+Number(button.dataset.direction))});
  });
  modal.querySelector('.modal__close').addEventListener('click',closeProject);
  modal.addEventListener('click',function(event){if(event.target===modal)closeProject()});
  document.addEventListener('keydown',function(event){
    if(event.key!=='Escape')return;
    if(!modal.hidden)closeProject();
    else if(!categoryModal.hidden)closeCategories();
  });

  var revealItems=document.querySelectorAll('.projects__intro,.projects__grid,.about__text,.about__photo,.skills,.contact__box');
  revealItems.forEach(function(element){element.classList.add('reveal')});
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}
      });
    },{threshold:.12});
    revealItems.forEach(function(element){observer.observe(element)});
  }else revealItems.forEach(function(element){element.classList.add('in')});
})();
