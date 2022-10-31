class Elem{
  constructor(){
    function arraysEqual(array1,array2){
      if(array1.length!==array2.length) return false;
      for(let i=0,l=array1.length;i<l;i++){
        if(array1[i]!==array2[i]){
          return false;
        }
      }
      return true;
    }
    function alterItems(array,alter){
      for(let i=0,l=array.length;i<l;i++){
        array[i] = alter(array[i]);
      }
      return array;
    }
    function arrayOnProp(array,prop,filterIfCondition=function(){return false;},alt=false){
      const keep = [];
      for(let i=0,l=array.length;i<l;i++){
        !filterIfCondition(array[i]) ? keep.push(array[i][prop]) : alt && keep.push(alt);
      }
      return keep;
    }
    function arrayIndexOf(array,condition){
      for(let i=0,l=array.length;i<l;i++){
        if(condition(array[i]))return i;
      }
      return -1;
    }
    function arrayHas(array,condition){
      for(let i=0,l=array.length;i<l;i++){
        if(condition(array[i]))return true;
      }
      return false;
    }
    function inArray(item,array){
      if(!array){
        return false;
      }
      for(let i=0,l=array.length;i<l;i++){
        if(item==array[i]){
          return true;
        }
      }
      return false;
    }
    function addToArray(item,array){
      array = !array ? [] : array;
      array.push(item);
      return [...new Set(array)];
    }
    function deleteFromArray(item,array){
      if(!array){
        return array;
      }
      const keep = [];
      for(let i=0,l=array.length;i<l;i++){
        if(item==array[i]){
          continue;
        }
        keep.push(item);
      }
      return keep.length===0 ? false : keep;
    }
    class ElemRoot {
      constructor(){

      }
      create(type,props=false){
        if(typeof type !== 'string'){
          const ob = type;
          type = Object.keys(ob)[0];
          props = ob[type];
        }
        !type && console.log('empty arg error coming',this.argsForErrors);
        if(!type){
          console.log('!type so div',{type,props});
          type = 'div';
        }
        //if(!type){throw('type is empty... see above for args');};
        if(type.indexOf('.') > -1 || type.indexOf('#') >-1 || type.indexOf('>') > -1){
          props = {};
          const chars = type.split('');
          for(let i=0,l=chars.length;i<l;i++){
            if(chars[i]==='.'||chars[i]==='#'||chars[i]==='>'){
              chars[i]='|'+chars[i];
            }
            if(chars[i]==='|>'){
              break;
            }
          }
          const parts = chars.join('').split('|');
          type = parts.shift();
          for(let i=0,l=parts.length;i<l;i++){
            if(parts[i][0]==='>'){
              props.innerHTML = parts[i].slice(1);
              continue;
            }
            if(parts[i][0]==='.'){
              props.className = props.className ? props.className + ' '+ parts[i].slice(1) :  parts[i].slice(1);
              continue;
            }
            if(parts[i][0]==='#'){
              props.id = parts[i].slice(1);
              continue;
            }
          }
        }
        !type && console.log('elem.js no type so making it div',{type,props});
        typeof type!='string' && console.log('type not string: ',type);
        type = typeof type!='string' ? 'div' : type;
        type = !type ? 'div' : type;
        let el = '';
        try{
          el = document.createElement(type);
        }
        catch{
          console.log('elem.js problem with type: ',{type,props});
          el = document.createElement('div');
        }
        if(!props)return el;
        if(typeof props != 'object'){
          console.log('elem.js props is not object',{props});
          return el;
        }
        for(let key in props){
          key = key == 'text' ? 'innerHTML' : key;
          props.innerHTML = props.text ? props.text : props.innerHTML;
          if(key==='style' || key==='l' || key==='callback'){
            continue;
          }
          if(key=='colspan' || key=='rowspan'){
            $(el).attr(key,props[key]);
            continue;
          }
          el[key] = props[key];
        }
        if(!props.style){
          props.callback && setTimeout(function(){props.callback(el)},0);
          return el
        };
        for(let key in props.style){
          $(el).css(key,props.style[key]);
        }
        props.callback && setTimeout(function(){props.callback(el)},0);
        return el;
      }
      nest(){
        for(let i=1,l=arguments.length;i<l;i++){
          arguments[0].appendChild(arguments[i]);
        }
        return arguments;
      }
      append(){
        for(let i=1,l=arguments.length;i<l;i++){
          arguments[i-1].appendChild(arguments[i]);
        }
        return arguments;
      }
      find(){
        const finding = {};
        for(let i=0,l=arguments.length;i<l;i++){
          if(!isNaN(arguments[i])){
            finding.index = arguments[i];
            continue;
          }
          if(arguments[i]==='last'){
            finding.last = true;
            continue;
          }
          if(arguments[i]==='first'){
            finding.first = true;
            continue;
          }
          if(typeof arguments[i] === 'string'){
            finding.tag = arguments[i].toUpperCase();
          }
          finding.elements = arguments[i];
        }
        if(finding.last){
          for(let i = finding.elements.length-1; i > 0; i--){
            if(finding.elements[i].tagName===finding.tag){
              return finding.elements[i];
            }
          }
          return null;
        }
        if(finding.index){
          let elCount = 0;
          for(let i = 0,l = elements.length; i > 0; i++){
            if(finding.elements[i].tagName===finding.tag){
              elCount++;
              if(elCount===finding.index){
                return finding.elements[i];
              }
            }
          }
          return null;
        }
        for(let i = 0,l = elements.length; i > 0; i++){
          if(finding.elements[i].tagName===finding.tag){
            return finding.elements[i];
          }
        }
        return null;
      }
      parseBuildMultiArgs(args){
        const keep = [];
        for(let i=0,l=args.length;i<l;i++){
          const arg = args[i];
          if(typeof arg !== 'string'){
            keep.push(arg);
            continue;
          }
          if(arg.indexOf(',') > -1 && arg.indexOf('>') === -1){
            const splitArgs = arg.split(',');
            for(let z=0,c=splitArgs.length;z<c;z++){
              keep.push(splitArgs[z]);
            }
          }
          else{
            keep.push(arg);
          }
        }
        return keep;
      }
      createBuildArg(arg){
        if(typeof arg === 'string'){
          return {el:this.create(arg)}
        }
        if(arg.el){
          return arg;
        }
        if(arg.nodeType){
          return {el:arg};
        }
        const key = Object.keys(arg)[0];
        return {el: this.create(arg), l:arg[key].l};
      }
      getTag(el){
        return el.tagName.toLowerCase();
      }
      usesArgStepShortCut(args){
        this.argStepAutoLev = {};
        let uses = false;
        for(let i=1,l=args.length;i<l;i++){
          if(args[i].el && args[i-1].el){
            if(this.getTag(args[i-1].el)==='tr' && (this.getTag(args[i].el)==='td' || this.getTag(args[i].el)==='th')){
              return true;
            }
            if((this.getTag(args[i-1].el)==='ul' || this.getTag(args[i-1].el)==='ol') && this.getTag(args[i].el)==='li'){
              return true;
            }
          }
        }
        return false;
      }
      doArgStepAutoLev(arg,argPre,curLev){
        if(!argPre || !arg || !argPre.el || !arg.el){
          return curLev;
        }
        const autoIncUp = {tr:'table',td:'tr',th:'tr',li:'ul'};
        const autoIncUpAlt = {li:'ol'};
        const tag = this.getTag(arg.el);
        const preTag = this.getTag(argPre.el);
        const doAutoIncUp = autoIncUp[tag]===preTag || autoIncUpAlt[tag]===preTag;
        curLev = doAutoIncUp ? curLev+1 : curLev;
        if(autoIncUp[tag]){
          this.argStepAutoLev[tag] = isNaN(this.argStepAutoLev[tag]) ? curLev : this.argStepAutoLev[tag];
          curLev = this.argStepAutoLev[tag];
        }
        else if((preTag === 'td' || preTag === 'th') && tag !== 'tr' && (tag !== 'td' && tag !== 'th')){
          curLev = this.argStepAutoLev.td+1;
        }
        else if(preTag==='li' && tag!=='li'){
          curLev = this.argStepAutoLev.td+1;
        }
        return curLev;
      }
      parseBuildArgsWithSteps(args){
        const parsed = [];
        let curLev = 0;
        const specialEls = {table:1,tr:1,td:1,th:1,ul:1,ol:1}
        for(let i=0,l=args.length;i<l;i++){
          if(!isNaN(args[i])){
            continue;
          }
          args[i] = this.createBuildArg(args[i]);
        }
        if(!specialEls[this.getTag(args[0].el)] && !args[0].l && args[0].l!==0 && isNaN(args[1])){
          args.splice(1,0,1);
        }
        const usesAutoLev = this.usesArgStepShortCut(args);
        for(let i=0,l=args.length;i<l;i++){
          if(!isNaN(args[i])){
            curLev+=args[i];
            continue;
          }
          curLev = usesAutoLev ? this.doArgStepAutoLev(args[i],args[i-1],curLev) : curLev;
          args[i].l = curLev;
          parsed.push(args[i]);
        }
        return parsed;
      }
      parseBuildArgs(args){
        const parsed = [];
        args = this.parseBuildMultiArgs(args);
        if(arrayHas(args,function(item){return !isNaN(item);})||!arrayHas(args,function(item){return item.l;})) return this.parseBuildArgsWithSteps(args);
        let minL = Infinity;
        for(let i=0,l=args.length;i<l;i++){
          args[i] = this.createBuildArg(args[i]);
          minL = args[i].l && args[i].l < minL ? args[i].l : minL;
        }
        minL = minL === Infinity ? 1 : minLe;
        args[0].l = !args[0].l && args[0].l !== 0 ? minL-1 : args[0].l;
        for(let i=1,l=args.length;i<l;i++){
          if(!args[i].l && args[i].l!==0){
            args[i].l = args[i-1].l;
          }
        }
        return args;
      }
      build(){
        const args = this.parseBuildArgs(arguments);
        const elAtLev = {[args[0].l]:args[0].el};
        const els = [args[0].el];
        for(let i=1,l=args.length;i<l;i++){
          const curLev = args[i].l === 0 ? 0 : args[i].l-1;
          elAtLev[curLev].appendChild(args[i].el);
          elAtLev[args[i].l] = args[i].el;
          els.push(args[i].el);
        }
        return els;
      }
      as(...args){
        this.argsForErrors = args;
        if(Array.isArray(args[0])){
          return this.as(...args[0]);
        }
        const els = this.build(...args);
        const el = els[0];
        el.i = function(index){
          return els[index];
        }
        el.all = function(){
          return els;
        }
        el.to = function(parent=document.body){
          parent.appendChild(el);
          return el;
        }
        this.argsForErrors = '';
        return el;//this.build(...args)[0];
      }
      clear(el){
        while(el.firstChild){
          el.removeChild(el.firstChild);
        }
        return el;
      }
    }
    return new ElemRoot();
  }
}
