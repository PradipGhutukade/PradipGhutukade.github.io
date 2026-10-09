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
          return exists?{title:'Project '+id,cover:base+'cover.jpg',video:base+'video.mp4'}:null;
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
  var role=modal.querySelector('.modal__role');
  function openProject(project,category,trigger){
    lastProjectTrigger=trigger;
    projectTitle.textContent=project.title+' | '+category.title;
    projectDescription.textContent='A '+category.title.toLowerCase()+' project created to bring the idea to life through polished visuals and considered storytelling.';
    projectCategory.textContent=category.title;
    role.textContent='My role. '+category.role;
    video.poster=project.cover;
    video.src=project.video;
    modal.hidden=false;
    document.body.classList.add('modal-open');
    modal.querySelector('.modal__close').focus();
    video.play().catch(function(){});
  }
  function closeProject(){
    video.pause();
    video.removeAttribute('src');
    video.removeAttribute('poster');
    video.load();
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
